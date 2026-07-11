const axios = require("axios");
// import getDistanceBetweenCoordinates from "./getDistanceBetweenCoordinates.js";

const OSRM = "https://router.project-osrm.org";

// find nearest place
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371000;

    const toRad = (deg) =>
        (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);

    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return (
        2 *
        R *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        )
    );
}

// find nearest neighbour
function reorderPlaces(
    currentLocation,
    places
) {

    const remaining = [...places];

    const ordered = [];

    let current = currentLocation;

    while (remaining.length) {

        let nearestIndex = 0;

        let nearestDistance = Infinity;

        remaining.forEach((place, index) => {

            const d = calculateDistance(
                current.latitude,
                current.longitude,
                place.place.latitude,
                place.place.longitude
            );

            if (d < nearestDistance) {

                nearestDistance = d;

                nearestIndex = index;

            }

        });

        const nearest =
            remaining.splice(
                nearestIndex,
                1
            )[0];

        ordered.push(nearest);

        current = {
            latitude:
                nearest.place.latitude,
            longitude:
                nearest.place.longitude,
        };

    }

    return ordered;

}

const getDistanceBetweenCoordinates = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const EARTH_RADIUS = 6371000; // meters

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // Distance in meters
};
async function getRouteGeometry(
    source,
    destination,
) {

    const url =
        `${OSRM}/route/v1/driving/` +
        `${source.longitude},${source.latitude};` +
        `${destination.longitude},${destination.latitude}` +
        `?overview=full&geometries=geojson`;

    const { data } =
        await axios.get(url);

    const route =
        data.routes[0];

    return {

        geometry:
            route.geometry,

        distance:
            route.distance,

        duration:
            route.duration,

    };

}
// provide routes from CL
async function buildNavigationRoute({
    startLocation,
    currentLocation,
    completedPlaces,
    remainingPlaces,
}) {

    const places = [];

    let previousLocation = startLocation;

    // -------------------------
    // Completed Places
    // -------------------------

    for (const completedPlace of completedPlaces) {

        const geometry =
            await getRouteGeometry(
                previousLocation,
                {
                    latitude: completedPlace.place.latitude,
                    longitude: completedPlace.place.longitude,
                }
            );

        places.push({

            ...completedPlace.toObject(),

            route: {

                geometry,

                color: "#4CAF50",

                status: "completed",

            },

        });

        previousLocation = {
            latitude: completedPlace.place.latitude,
            longitude: completedPlace.place.longitude,
        };

    }

    // -------------------------
    // Remaining Places
    // -------------------------

    previousLocation =
        completedPlaces.length
            ? {
                latitude:
                    completedPlaces[
                        completedPlaces.length - 1
                    ].place.latitude,

                longitude:
                    completedPlaces[
                        completedPlaces.length - 1
                    ].place.longitude,
            }
            : currentLocation;

    for (let index = 0; index < remainingPlaces.length; index++) {

        const remainingPlace =
            remainingPlaces[index];

        const geometry =
            await getRouteGeometry(
                previousLocation,
                {
                    latitude: remainingPlace.place.latitude,
                    longitude: remainingPlace.place.longitude,
                }
            );

        places.push({

            ...remainingPlace.toObject(),

            route: {

                geometry,

                color:
                    index === 0
                        ? "#2196F3"
                        : "#9E9E9E",

                status:
                    index === 0
                        ? "current"
                        : "pending",

            },

        });

        previousLocation = {
            latitude: remainingPlace.place.latitude,
            longitude: remainingPlace.place.longitude,
        };

    }

    return places;

}


const getTourNavigationResponse = async ({
    tour,
    currentLocation,
}) => {

    // -----------------------------
    // Completed Places
    // -----------------------------

    const completedPlaces = tour.places
        .filter(place => place.visited)
        .sort((a, b) => a.visitSequence - b.visitSequence);

    // -----------------------------
    // Remaining Places
    // -----------------------------

    const remainingPlaces = tour.places
        .filter(place => !place.visited)
        .sort((a, b) => a.sequence - b.sequence);

    // -----------------------------
    // Build Route For Every Place
    // -----------------------------

    const places =
        await buildNavigationRoute({

            startLocation: tour.startLocation,

            currentLocation,

            completedPlaces,

            remainingPlaces,

        });

    // -----------------------------
    // Response
    // -----------------------------

    return {

        tourId: tour._id,

        name: tour.name,

        description: tour.description,

        status: tour.status,

        startedAt: tour.startedAt,

        completedAt: tour.completedAt,

        currentLocation,

        totalPlaces: tour.places.length,

        visitedPlaces:
            completedPlaces.length,

        remainingPlaces:
            remainingPlaces.length,

        places,

    };

};



const updateVisitedPlaces = async ({
    tour,
    currentLocation,
}) => {

    const { latitude, longitude } = currentLocation;
    const VISIT_RADIUS = 100; // meters

    let visitSequence = Math.max(
        0,
        ...tour.places.map(
            place => place.visitSequence || 0
        )
    );

    let updated = false;

    for (const place of tour.places) {

        if (place.visited) continue;

        const distance =
            getDistanceBetweenCoordinates(
                latitude,
                longitude,
                place.place.latitude,
                place.place.longitude
            );

        if (distance <= VISIT_RADIUS) {

            place.visited = true;
            place.visitedAt = new Date();
            place.visitSequence = ++visitSequence;

            updated = true;
        }
    }

    // Complete the tour if all places are visited
    if (
        tour.places.length > 0 &&
        tour.places.every(place => place.visited)
    ) {
        tour.status = "completed";
        tour.completedAt = new Date();
        updated = true;
    }

    if (updated) {
        await tour.save();
    }

    return tour;
};




module.exports = {
    buildNavigationRoute,
    getTourNavigationResponse,
    updateVisitedPlaces,
};


// async function buildNavigationRoute({
//     tour,
//     currentLocation,
// }) {

//     const remainingPlaces =
//         tour.places.filter(
//             (p) => !p.visited
//         );

//     if (!remainingPlaces.length) {

//         return {

//             route: null,

//             places: [],

//             totalDistance: 0,

//             totalDuration: 0,

//         };

//     }

//     const orderedPlaces =
//         reorderPlaces(
//             currentLocation,
//             remainingPlaces
//         );

//     const coordinates = [

//         `${currentLocation.longitude},${currentLocation.latitude}`,

//         ...orderedPlaces.map(
//             (p) =>
//                 `${p.place.longitude},${p.place.latitude}`
//         ),

//     ].join(";");

//     const url =
//         `${OSRM}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

//     const { data } =
//         await axios.get(url);

//     const route =
//         data.routes[0];

//     return {

//         currentLocation,

//         nextPlace:
//             orderedPlaces[0],

//         orderedPlaces,

//         totalDistance:
//             route.distance,

//         totalDuration:
//             route.duration,

//         geometry:
//             route.geometry,

//     };

// }


// const getTourNavigationResponse = async ({
//     tour,
//     currentLocation,
// }) => {

//     console.log("tour =", tour);
//     console.log("places =", tour?.places);
//     // -----------------------------
//     // Completed Places
//     // -----------------------------

//     const completedPlaces = tour.places
//         .filter(place => place.visited)
//         .sort((a, b) => a.visitSequence - b.visitSequence);

//     // -----------------------------
//     // Remaining Places
//     // -----------------------------

//     const remainingPlaces = tour.places
//         .filter(place => !place.visited)
//         .sort((a, b) => a.sequence - b.sequence);

//     // -----------------------------
//     // Build Completed Route
//     // -----------------------------

//     const completedCoordinates = [];

//     if (tour.startLocation) {

//         completedCoordinates.push([
//             tour.startLocation.longitude,
//             tour.startLocation.latitude,
//         ]);

//     }

//     completedPlaces.forEach(place => {

//         completedCoordinates.push([
//             place.place.longitude,
//             place.place.latitude,
//         ]);

//     });

//     const completedRoute = {
//         type: "LineString",
//         coordinates: completedCoordinates,
//     };

//     // -----------------------------
//     // Build Remaining Route
//     // -----------------------------

//     let navigation = {
//         uncompletedRoute: {
//             type: "LineString",
//             coordinates: [],
//         },
//         remainingPlaces: [],
//     };

//     if (remainingPlaces.length) {

//         navigation = await buildNavigationRoute({
//             currentLocation,
//             places: remainingPlaces,
//         });

//     }

//     // -----------------------------
//     // Final Response
//     // -----------------------------

//     return {

//         status: tour.status,

//         completed: tour.status === "completed",

//         currentLocation,

//         completedRoute,

//         uncompletedRoute:
//             navigation.uncompletedRoute,

//         remainingPlaces:
//             navigation.remainingPlaces,

//     };

// };

// const getTourNavigationResponse = async ({
//     tour,
//     currentLocation,
// }) => {

//     console.log("tour =", tour);
//     console.log("places =", tour?.places);
//     // -----------------------------
//     // Completed Places
//     // -----------------------------

//     const completedPlaces = tour.places
//         .filter(place => place.visited)
//         .sort((a, b) => a.visitSequence - b.visitSequence);

//     // -----------------------------
//     // Remaining Places
//     // -----------------------------

//     const remainingPlaces = tour.places
//         .filter(place => !place.visited)
//         .sort((a, b) => a.sequence - b.sequence);

//     // -----------------------------
//     // Build Completed Route
//     // -----------------------------

//     const completedCoordinates = [];

//     if (tour.startLocation) {

//         completedCoordinates.push([
//             tour.startLocation.longitude,
//             tour.startLocation.latitude,
//         ]);

//     }

//     completedPlaces.forEach(place => {

//         completedCoordinates.push([
//             place.place.longitude,
//             place.place.latitude,
//         ]);

//     });

//     const completedRoute = {
//         type: "LineString",
//         coordinates: completedCoordinates,
//     };

//     // -----------------------------
//     // Build Remaining Route
//     // -----------------------------

//     let navigation = {
//         uncompletedRoute: {
//             type: "LineString",
//             coordinates: [],
//         },
//         remainingPlaces: [],
//     };

//     if (remainingPlaces.length) {

//         navigation = await buildNavigationRoute({
//             currentLocation,
//             places: remainingPlaces,
//         });

//     }

//     // -----------------------------
//     // Final Response
//     // -----------------------------

//     return {

//         status: tour.status,

//         completed: tour.status === "completed",

//         currentLocation,

//         completedRoute,

//         uncompletedRoute:
//             navigation.uncompletedRoute,

//         remainingPlaces:
//             navigation.remainingPlaces,

//     };

// };

