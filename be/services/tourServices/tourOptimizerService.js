const {
    getDistanceMatrix,
    // getRouteGeometry,
    getOptimizedRoute
} = require("./osrmService");
const { solveTSP } = require("../../utils/tsp");

/**
 * Optimize Tour
 *
 * Receives:
 * places[]
 *
 * Returns:
 * optimizedPlaces
 * routes
 * totalDistance
 * totalDuration
 */


const optimizeTour = async (places) => {

    if (!places.length) {
        return {
            optimizedPlaces: [],
            legs: [],
            totalDistance: 0,
        };
    }

    if (places.length === 1) {
        return {
            optimizedPlaces: places,
            legs: [],
            totalDistance: 0,
        };
    }

    const matrix = await getDistanceMatrix(places);

    const visited = new Array(places.length).fill(false);

    const optimizedPlaces = [];

    const legs = [];

    let totalDistance = 0;

    let current = 0;

    visited[current] = true;

    optimizedPlaces.push(places[current]);

    while (optimizedPlaces.length < places.length) {

        let nextIndex = -1;

        let shortestDistance = Infinity;

        for (let i = 0; i < places.length; i++) {

            if (visited[i]) {
                continue;
            }

            const distance = matrix[current][i];

            if (distance < shortestDistance) {

                shortestDistance = distance;

                nextIndex = i;

            }

        }

        if (nextIndex === -1) {
            break;
        }

        legs.push({

            from: places[current]._id,

            to: places[nextIndex]._id,

            distance: shortestDistance,

        });

        totalDistance += shortestDistance;

        optimizedPlaces.push(places[nextIndex]);

        visited[nextIndex] = true;

        current = nextIndex;

    }

    return {

        optimizedPlaces,

        legs,

        totalDistance,

    };

};



// const optimizeTour = async (places) => {

//     if (places.length <= 1) {
//         return places;
//     }

//     const matrix =
//         await getDistanceMatrix(places);

//     const visited =
//         new Array(places.length).fill(false);

//     const optimized = [];

//     let current = 0;

//     visited[current] = true;

//     optimized.push(places[current]);

//     while (optimized.length < places.length) {

//         let nextIndex = -1;
//         let shortestDistance = Infinity;

//         for (let i = 0; i < places.length; i++) {

//             if (visited[i]) {
//                 continue;
//             }

//             const distance =
//                 matrix[current][i];

//             if (distance < shortestDistance) {

//                 shortestDistance = distance;
//                 nextIndex = i;

//             }

//         }

//         if (nextIndex === -1) {
//             break;
//         }

//         visited[nextIndex] = true;

//         optimized.push(
//             places[nextIndex]
//         );

//         current = nextIndex;

//     }

//     return optimized;

// };


module.exports = {

    optimizeTour,

};
