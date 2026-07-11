const Place = require("../../models/tourModel/Place");
const { search } = require("../../providers/nominatimProvider");

const findOrCreatePlace = async (searchQuery) => {

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    // Check cache
    let place = await Place.findOne({
        searchQuery: normalizedSearchQuery,
    });

    if (place) {
        return place;
    }

    // Search Nominatim
    const data = await search(searchQuery.trim());

    if (!data || !data.length) {
        return null;
    }

    const result = data[0];

    place = await Place.create({

        searchQuery: normalizedSearchQuery,

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

    });

    return place;

};

module.exports = {
    findOrCreatePlace,
};