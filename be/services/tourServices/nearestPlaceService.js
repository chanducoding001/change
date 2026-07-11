const {
    getRouteBetweenTwoPoints,
} = require("./osrmService");

/**
 * Euclidean Distance
 * Used only to find the nearest place quickly.
 * Actual road distance comes from OSRM.
 */
const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const dx = lat1 - lat2;

    const dy = lon1 - lon2;

    return Math.sqrt(dx * dx + dy * dy);

};


/**
 * Find Nearest Unvisited Place
 */
const findNearestPlace = async (

    currentLatitude,

    currentLongitude,

    places

) => {

    const remainingPlaces =
        places.filter(
            place => !place.visited
        );

    if (!remainingPlaces.length) {

        return {

            completed: true,

            nearestPlace: null,

            remainingPlaces: [],

            geometry: null,

            distance: 0,

            duration: 0,

        };

    }

    let nearestPlace =
        remainingPlaces[0];

    let shortest =
        Number.MAX_VALUE;

    for (const place of remainingPlaces) {

        const d =
            calculateDistance(

                currentLatitude,

                currentLongitude,

                place.latitude,

                place.longitude

            );

        if (d < shortest) {

            shortest = d;

            nearestPlace = place;

        }

    }


    const route =
        await getRouteBetweenTwoPoints(

            currentLatitude,

            currentLongitude,

            nearestPlace.latitude,

            nearestPlace.longitude

        );


    return {

        completed: false,

        nearestPlace,

        remainingPlaces,

        geometry:
            route.geometry,

        distance:
            route.distance,

        duration:
            route.duration,

    };

};

module.exports = {

    findNearestPlace,

};