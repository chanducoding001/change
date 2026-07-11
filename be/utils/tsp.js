/**
 * Calculate total route distance
 */
const calculateDistance = (order, distances) => {

    let total = 0;

    for (let i = 0; i < order.length - 1; i++) {

        total += distances[
            order[i]
        ][
            order[i + 1]
        ];

    }

    return total;

};


/**
 * Nearest Neighbor
 */
const nearestNeighbor = (places, distances) => {

    const visited = new Array(places.length).fill(false);

    const order = [];

    let current = 0;

    order.push(current);

    visited[current] = true;

    while (order.length < places.length) {

        let nearest = -1;

        let shortest = Number.MAX_VALUE;

        for (let i = 0; i < places.length; i++) {

            if (visited[i]) continue;

            const d = distances[current][i];

            if (
                d != null &&
                d < shortest
            ) {

                shortest = d;

                nearest = i;

            }

        }

        visited[nearest] = true;

        order.push(nearest);

        current = nearest;

    }

    return order;

};


/**
 * Reverse route section
 */
const reverse = (route, i, k) => {

    const newRoute = [...route];

    while (i < k) {

        const temp = newRoute[i];

        newRoute[i] = newRoute[k];

        newRoute[k] = temp;

        i++;

        k--;

    }

    return newRoute;

};


/**
 * 2-OPT Improvement
 */
const twoOpt = (route, distances) => {

    let improved = true;

    let best = [...route];

    while (improved) {

        improved = false;

        const bestDistance =
            calculateDistance(
                best,
                distances
            );

        for (let i = 1; i < best.length - 2; i++) {

            for (
                let k = i + 1;
                k < best.length - 1;
                k++
            ) {

                const candidate =
                    reverse(best, i, k);

                const candidateDistance =
                    calculateDistance(
                        candidate,
                        distances
                    );

                if (
                    candidateDistance <
                    bestDistance
                ) {

                    best.splice(
                        0,
                        best.length,
                        ...candidate
                    );

                    improved = true;

                    break;

                }

            }

            if (improved) break;

        }

    }

    return best;

};


/**
 * Solve TSP
 */
const solveTSP = (
    places,
    distances
) => {

    if (
        !places ||
        places.length <= 1
    ) {

        return places;

    }

    let order =
        nearestNeighbor(
            places,
            distances
        );

    order =
        twoOpt(
            order,
            distances
        );

    return order.map(
        index => places[index]
    );

};


module.exports = {

    solveTSP,

};