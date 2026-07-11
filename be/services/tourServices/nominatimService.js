const axios = require("axios");
const Tour = require("../../models/tourModel/Tour");

const {
    optimizeTour,
} = require("./tourOptimizerService");
const { search } = require("../../providers/nominatimProvider");




const searchPlace = async (searchQuery) => {

    searchQuery = searchQuery.trim();

    const existingTour = await Tour.findOne(
        {
            "places.searchQuery": searchQuery,
        },
        {
            places: {
                $elemMatch: {
                    searchQuery,
                },
            },
        }
    );

    if (existingTour?.places?.length) {

        return {
            ...existingTour.places[0].toObject(),
            visited: false,
            visitedAt: null,
        };

    }

    const data = await search(searchQuery);

    if (!data?.length) {
        return null;
    }

    const result = data[0];

    return {

        searchQuery,

        name:
            result.name ||
            result.display_name.split(",")[0],

        displayName:
            result.display_name,

        latitude:
            Number(result.lat),

        longitude:
            Number(result.lon),

        address:
            result.display_name,

        osmId:
            result.osm_id,

        visited: false,

        visitedAt: null,

    };

};


/**
 * Create Tour
 */
const createTourFromSearch = async (
    searchQuery
) => {

    const query =
        encodeURIComponent(searchQuery);

    const url =
        `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&addressdetails=1&limit=50`;

    const response =
        await axios.get(url, {

            headers: {

                "User-Agent":
                    "GIS-Tour-Optimizer/1.0",

            },

        });

    const results =
        response.data;

    if (!results.length) {

        throw new Error(
            "No places found."
        );

    }

    /**
     * Convert Nominatim
     * response into Place objects
     */

    const places = results.map((item, index) => ({
            searchQuery,
            name:
                item.name ||
                item.display_name.split(",")[0],
            displayName:item.display_name,
            osmId:item.osm_id,
            latitude:Number(item.lat),
            longitude:Number(item.lon),
            address:item.display_name,
            visited: false,
            visitedAt: null,
            order:index + 1,

        }));


    /**
     * Optimize Tour
     */

    const optimized = await optimizeTour(places);

    /**
     * Save MongoDB
     */

    const tour = await Tour.create({

            searchQuery,

            places:
                optimized.places,

            routes:
                optimized.routes,

            totalDistance:
                optimized.totalDistance,

            totalDuration:
                optimized.totalDuration,

            status:
                "pending",

        });

    return tour;

};


module.exports = {

    createTourFromSearch,
    searchPlace

};









// const axios = require("axios");

// const Tour = require("../models/Tour");

// /**
//  * Create Tour from Search Query
//  *
//  * Flow
//  * Search Query
//  *      ↓
//  * Nominatim
//  *      ↓
//  * Convert Results → Places[]
//  *      ↓
//  * Save MongoDB
//  *      ↓
//  * Return Tour
//  */
// const createTourFromSearch = async (searchQuery) => {

//     // Encode query
//     const query = encodeURIComponent(searchQuery);

//     // Call Nominatim
//     const url =
//         `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&addressdetails=1&limit=50`;

//     const response = await axios.get(url, {
//         headers: {
//             "User-Agent": "GIS-Tour-Optimizer/1.0",
//         },
//     });

//     const results = response.data;

//     if (!results.length) {
//         throw new Error("No places found.");
//     }

//     // Convert into our schema
//     const places = results.map((item, index) => ({

//         searchQuery,

//         name:
//             item.name ||
//             item.display_name.split(",")[0],

//         displayName:
//             item.display_name,

//         osmId:
//             item.osm_id,

//         latitude:
//             Number(item.lat),

//         longitude:
//             Number(item.lon),

//         address:
//             item.display_name,

//         visited: false,

//         visitedAt: null,

//         order: index + 1,

//     }));


//     const tour = new Tour({

//         searchQuery,

//         places,

//         routes: [],

//         totalDistance: 0,

//         totalDuration: 0,

//         status: "pending",

//     });

//     await tour.save();

//     return tour;
// };

// module.exports = {

//     createTourFromSearch,

// };