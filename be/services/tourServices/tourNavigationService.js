const axios = require("axios");

const OSRM_BASE_URL = process.env.OSRM_BASE_URL || "https://router.project-osrm.org";

const ROUTE_COLORS = {
    next: "#2E7D32",
    remaining: "#F9A825",
    completed: "#757575",
};

const reverseGeocode = async ({ latitude, longitude }) => {
    const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
            params: {
                lat: latitude,
                lon: longitude,
                format: "jsonv2",
                addressdetails: 1,
            },
            headers: {
                "User-Agent": "TourApplication/1.0",
            },
        }
    );

    return {
        latitude,
        longitude,
        name:
            data.name ||
            data.address?.village ||
            data.address?.town ||
            data.address?.city ||
            "",
        displayName: data.display_name,
        address: {
            country: data.address?.country,
            state: data.address?.state,
            district:
                data.address?.state_district ||
                data.address?.county,
            subDistrict:
                data.address?.suburb ||
                data.address?.municipality,
            village:
                data.address?.village ||
                data.address?.hamlet,
            postcode: data.address?.postcode,
        },
    };
};

function normalizeCoordinate(value) {
    return Number(value.toFixed(3));
}
const getRoute = async ({
    startLocation,
    endLocation,
}) => {

    const coordinates = [
        `${startLocation.longitude},${startLocation.latitude}`,
        `${endLocation.longitude},${endLocation.latitude}`,
    ].join(";");

    const url =
        `${OSRM_BASE_URL}/route/v1/driving/${coordinates}` +
        "?overview=full" +
        "&geometries=geojson" +
        "&steps=true";

    const { data } = await axios.get(url);

    if (
        !data.routes ||
        data.routes.length === 0
    ) {
        throw new Error("Unable to calculate route.");
    }

    const route = data.routes[0];

    return {
        distance: route.distance,      // meters
        duration: route.duration,      // seconds
        geometry: route.geometry,
        legs: route.legs,
    };
};

const mapTourPlace = (tourPlace) => ({
    _id: tourPlace._id,

    sequence: tourPlace.sequence,

    visitSequence: tourPlace.visitSequence,

    visited: tourPlace.visited,

    visitedAt: tourPlace.visitedAt,

    distanceFromPrevious: tourPlace.distanceFromPrevious,

    place: {
        _id: tourPlace.place._id,
        searchQuery: tourPlace.place.searchQuery,
        name: tourPlace.place.name,
        displayName: tourPlace.place.displayName,
        latitude: tourPlace.place.latitude,
        longitude: tourPlace.place.longitude,
        address: tourPlace.place.address,
    },
});


// const findNextPlace = async ({
//     currentLocation,
//     remainingPlaces,
// }) => {

//     if (!remainingPlaces.length) {
//         return null;
//     }

//     let nearestPlace = null;

//     let shortestDistance = Number.MAX_SAFE_INTEGER;

//     for (const place of remainingPlaces) {

//         const route = await getRoute({
//             startLocation: currentLocation,
//             endLocation: {
//                 latitude: place.place.latitude,
//                 longitude: place.place.longitude,
//             },
//         });

//         if (route.distance < shortestDistance) {

//             shortestDistance = route.distance;

//             nearestPlace = {
//                 ...place,
//                 route: {
//                     distance: route.distance,
//                     duration: route.duration,
//                     geometry: route.geometry,
//                 },
//             };

//         }
//     }

//     return nearestPlace;

// };

/**
 * Returns the distance between two coordinates in meters.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in meters
 */
const haversineDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const EARTH_RADIUS = 6371000; // meters

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return Math.round(EARTH_RADIUS * c);
};


const MAX_ROUTE_CANDIDATES = 3;

// don't reroute unless BOTH conditions are met
const MIN_DISTANCE_DIFFERENCE = 100; // meters
const MIN_PERCENT_IMPROVEMENT = 0.20; // 20%

const findNextPlace = async ({
    tour,
    currentLocation,
}) => {

    const remainingPlaces = tour.places.filter(
        place => !place.visited
    );

    if (!remainingPlaces.length) {
        return null;
    }

    // ---------------------------------------------------
    // Shortlist nearest places using Haversine
    // ---------------------------------------------------

    const candidates = remainingPlaces
        .map(place => ({
            place,
            straightDistance: haversineDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                place.place.latitude,
                place.place.longitude
            ),
        }))
        .sort(
            (a, b) =>
                a.straightDistance -
                b.straightDistance
        )
        .slice(0, MAX_ROUTE_CANDIDATES);

    // ---------------------------------------------------
    // Find nearest by road distance
    // ---------------------------------------------------

    let nearest = null;

    for (const candidate of candidates) {

        const route = await getRoute({
            startLocation: currentLocation,
            endLocation: {
                latitude: candidate.place.place.latitude,
                longitude: candidate.place.place.longitude,
            },
        });

        if (
            !nearest ||
            route.distance < nearest.route.distance
        ) {

            nearest = {
                place: candidate.place,
                route,
            };

        }

    }

    // ---------------------------------------------------
    // First navigation target
    // ---------------------------------------------------

    if (!tour.currentNextPlace) {

        tour.currentNextPlace = nearest.place.place._id;

        return nearest;

    }

    // ---------------------------------------------------
    // Current target
    // ---------------------------------------------------

    const currentTarget = remainingPlaces.find(
        place =>
            place.place._id.equals(
                tour.currentNextPlace
            )
    );

    if (!currentTarget) {

        tour.currentNextPlace = nearest.place.place._id;

        return nearest;

    }

    // ---------------------------------------------------
    // Route to current target
    // ---------------------------------------------------

    const currentRoute = await getRoute({
        startLocation: currentLocation,
        endLocation: {
            latitude: currentTarget.place.latitude,
            longitude: currentTarget.place.longitude,
        },
    });

    // ---------------------------------------------------
    // Same target
    // ---------------------------------------------------

    if (
        currentTarget.place._id.equals(
            nearest.place.place._id
        )
    ) {

        return {
            place: currentTarget,
            route: currentRoute,
        };

    }

    // ---------------------------------------------------
    // Decide whether to reroute
    // ---------------------------------------------------

    const distanceDifference =
        currentRoute.distance -
        nearest.route.distance;

    const percentImprovement =
        distanceDifference /
        currentRoute.distance;

    const shouldSwitch =

        distanceDifference >=
        MIN_DISTANCE_DIFFERENCE

        &&

        percentImprovement >=
        MIN_PERCENT_IMPROVEMENT;

    if (shouldSwitch) {

        tour.currentNextPlace =
            nearest.place.place._id;

        return nearest;

    }

    // ---------------------------------------------------
    // Continue navigating to current target
    // ---------------------------------------------------

    return {

        place: currentTarget,

        route: currentRoute,

    };

};


const VISIT_RADIUS = Number(
    process.env.TOUR_VISIT_RADIUS ?? 50
);

const updateVisitedPlaces = async ({
    tour,
    currentLocation,
}) => {

    let maxVisitSequence = Math.max(
        0,
        ...tour.places.map(
            place => place.visitSequence || 0
        )
    );

    for (const place of tour.places) {

        if (place.visited) {
            continue;
        }

        const distance = haversineDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            place.place.latitude,
            place.place.longitude
        );

        if (distance > VISIT_RADIUS) {
            continue;
        }

        // -----------------------------
        // Mark place as visited
        // -----------------------------

        place.visited = true;
        place.visitedAt = new Date();
        place.visitSequence = ++maxVisitSequence;

        // -----------------------------
        // Planned distance covered
        // -----------------------------

        tour.visitedTotalDistanceFromStartLocation +=
            place.distanceFromPrevious;

        // -----------------------------
        // Current navigation target visited
        // -----------------------------

        if (
            tour.currentNextPlace &&
            place.place._id.equals(
                tour.currentNextPlace
            )
        ) {
            tour.currentNextPlace = null;
        }
    }

    // -----------------------------
    // Complete tour
    // -----------------------------

    const remaining = tour.places.some(
        place => !place.visited
    );

    if (!remaining) {
        tour.status = "completed";
        tour.completedAt = new Date();
    }

    return tour;
};


const getTourNavigationResponse = async ({
    tour,
    currentLocation,
}) => {

    /*
     * ----------------------------------------
     * Completed Places
     * ----------------------------------------
     */

    const completedPlaces = tour.places
        .filter(place => place.visited)
        .sort((a, b) => a.visitSequence - b.visitSequence)
        .map(place => ({
            ...mapTourPlace(place),
            routeColor: ROUTE_COLORS.completed,
            markerColor: ROUTE_COLORS.completed,
        }));

    /*
     * ----------------------------------------
     * Remaining Places
     * ----------------------------------------
     */

    let remainingPlaces = tour.places
        .filter(place => !place.visited)
        .map(place => ({
            ...mapTourPlace(place),
            routeColor: ROUTE_COLORS.remaining,
            markerColor: ROUTE_COLORS.remaining,
        }));

    /*
     * ----------------------------------------
     * Find Next Place
     * ----------------------------------------
     */

    const result = await findNextPlace({
        tour,
        currentLocation,
    });

    let nextPlace = null;

    if (result) {

        nextPlace = {
            ...mapTourPlace(result.place),

            markerColor: ROUTE_COLORS.next,

            routeColor: ROUTE_COLORS.next,

            route: {
                distance: result.route.distance,
                duration: result.route.duration,
                geometry: result.route.geometry,
            },
        };

        // remainingPlaces = remainingPlaces.filter(
        //     place => !place._id.equals(nextPlace._id)
        // );
        remainingPlaces = remainingPlaces.filter(
    place => String(place._id) !== String(nextPlace._id)
);
    }

    /*
     * ----------------------------------------
     * Response
     * ----------------------------------------
     */
    const isTourCompleted =
            tour.places.length > 0 &&
            tour.places.every(place => place.visited);

        
    return {

        status: tour.status,

        startedAt: tour.startedAt,

        completedAt: tour.completedAt,

        startLocation: tour.startLocation,
        isTourCompleted,

        currentLocation,

        progress: {

            totalPlaces: tour.places.length,

            completedPlaces: completedPlaces.length,

            remainingPlaces: remainingPlaces.length,

            actualTotalDistanceFromStartLocation:
                tour.actualTotalDistanceFromStartLocation,

            visitedTotalDistanceFromStartLocation:
                tour.visitedTotalDistanceFromStartLocation,

            actualTravelledDistance:
                tour.actualTravelledDistance,
        },

        places: [

            ...(nextPlace ? [nextPlace] : []),

            ...completedPlaces,

            ...remainingPlaces,

        ],
    };

};




module.exports = {
    getTourNavigationResponse,
    getRoute,
    updateVisitedPlaces,
    haversineDistance,
    normalizeCoordinate,
    reverseGeocode
};




// const getTourNavigationResponse = async ({
//     tour,
//     currentLocation,
// }) => {

//     // const completedPlaces = tour.places
//     //     .filter(place => place.visited)
//     //     .sort((a, b) => a.visitSequence - b.visitSequence)
//     //     .map(mapTourPlace);
//     const completedPlaces = tour.places
//     .filter(place => place.visited)
//     .sort((a, b) => a.visitSequence - b.visitSequence)
//     .map(place => ({
//         ...mapTourPlace(place),
//         routeColor: ROUTE_COLORS.completed,
//         markerColor: ROUTE_COLORS.completed,
//     }));

//     let remainingPlaces = tour.places
//     .filter(place => !place.visited)
//     .map(place => ({
//         ...mapTourPlace(place),
//         routeColor: ROUTE_COLORS.remaining,
//         markerColor: ROUTE_COLORS.remaining,
//     }));
//     // const remainingPlaces = tour.places
//     //     .filter(place => !place.visited)
//     //     .map(mapTourPlace);

//     const nextPlace = await findNextPlace({
//         currentLocation,
//         remainingPlaces,
//     });
//     remainingPlaces = remainingPlaces.filter(place=>place._id!==nextPlace._id);
//     nextPlace.routeColor = ROUTE_COLORS.next;
//     nextPlace.markerColor = ROUTE_COLORS.next;

//     return {

//         status: tour.status,

//         startedAt: tour.startedAt,

//         completedAt: tour.completedAt,

//         startLocation: tour.startLocation,

//         currentLocation,

//         progress: {

//             totalPlaces: tour.places.length,

//             completedPlaces: completedPlaces.length,

//             remainingPlaces: remainingPlaces.length,

//             actualTotalDistanceFromStartLocation:
//                 tour.actualTotalDistanceFromStartLocation,

//             visitedTotalDistanceFromStartLocation:
//                 tour.visitedTotalDistanceFromStartLocation,

//             actualTravelledDistance:
//                 tour.actualTravelledDistance,
//         },
//         places:[
//             nextPlace,

//             ...completedPlaces,

//             ...remainingPlaces,
//         ]
//         // nextPlace,

//         // completedPlaces,

//         // remainingPlaces,
//     };

// };
