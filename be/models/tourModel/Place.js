const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({

    searchQuery: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    name: {
        type: String,
        required: true,
    },

    displayName: String,

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    address: String,

    osmId: {
        type: Number,
        index: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("Place", placeSchema);
