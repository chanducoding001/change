const axios = require('axios');


const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let lastRequestTime = 0;

async function search(searchQuery) {

    const now = Date.now();

    const wait =
        Math.max(
            0,
            1000 - (now - lastRequestTime)
        );

    if (wait > 0) {
        await delay(wait);
    }

    lastRequestTime = Date.now();

    try {

        const { data } = await axios.get(
            NOMINATIM_URL,
            {
                params: {
                    q: searchQuery,
                    format: "jsonv2",
                    addressdetails: 1,
                    limit: 1,
                },
                headers: {
                    "User-Agent": "TourOptimizer/1.0",
                },
                timeout: 10000,
            }
        );

        return data;

    }
    catch (error) {

        if (error.response?.status === 429) {

            // Wait and retry once
            await delay(2000);

            const { data } = await axios.get(
                NOMINATIM_URL,
                {
                    params: {
                        q: searchQuery,
                        format: "jsonv2",
                        addressdetails: 1,
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "TourOptimizer/1.0",
                    },
                    timeout: 10000,
                }
            );

            return data;

        }

        throw error;

    }

}



module.exports = {

    search

};