const axios = require("axios");

const OSRM = "https://router.project-osrm.org";


// Build coordinate string
const buildCoordinates = (places) => {

    return places
        .map(
            place =>
                `${place.longitude},${place.latitude}`
        )
        .join(";");

};


/**
 * Distance Matrix
 *
 * Used for TSP
 */



const getDistanceMatrix = async (places) => {

    if (places.length <= 1) {
        return [[0]];
    }

    // const coordinates = places
    //     .map(place =>
    //         `${place.longitude},${place.latitude}`
    //     )
    //     .join(";");
    // const coordinates = places
    // .map(({ place }) =>
    //     `${place.longitude},${place.latitude}`
    // )
    // .join(";");
    const coordinates = places
    .map(place =>
        `${place.longitude},${place.latitude}`
    )
    .join(";");

    const url =
        `${OSRM}/table/v1/driving/${coordinates}?annotations=distance`;

    const { data } = await axios.get(url);

    if (data.code !== "Ok") {
        throw new Error("Unable to build distance matrix.");
    }

    return data.distances;

};


// const getDistanceMatrix = async (places) => {

//     const coordinates =
//         buildCoordinates(places);

//     const url =
//         `${OSRM}/table/v1/driving/${coordinates}?annotations=distance,duration`;

//     const { data } =
//         await axios.get(url);

//     return {

//         distances:
//             data.distances,

//         durations:
//             data.durations,

//     };

// };



/**
 * Complete Optimized Route
 *
 * Receives
 * optimized places
 */
const getOptimizedRoute = async (places) => {

        const coordinates =
            buildCoordinates(places);

        const url =
            `${OSRM}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

        const { data } =
            await axios.get(url);

        const route =
            data.routes[0];

        return {

            geometry:
                route.geometry,

            totalDistance:
                route.distance,

            totalDuration:
                route.duration,

        };

};



/**
 * Route Between Two Points
 *
 * Current Location
 * ↓
 * Nearest Place
 */
const getRouteBetweenTwoPoints =
    async (
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude
    ) => {

        const coordinates =
            `${startLongitude},${startLatitude};${endLongitude},${endLatitude}`;

        const url =
            `${OSRM}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

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

    };



module.exports = {

    getDistanceMatrix,

    getOptimizedRoute,

    getRouteBetweenTwoPoints,

};