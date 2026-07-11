const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({

    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true,
    },

    sequence: {
        type: Number,
        required: true,
    },
     distanceFromPrevious: {
        type: Number,
        default: 0,
    },
    visited: {
        type: Boolean,
        default: false,
    },

    visitedAt: Date,
    visitSequence: {
            type: Number,
            default: null,
    },

}, { _id: true });

const unresolvedPlaceSchema = new mongoose.Schema({

    searchQuery: {
        type: String,
        required: true,
        trim: true,
    },

    reason: {
        type: String,
        default: "Location not found",
    },

}, { _id: false });

const tourSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    status: {
        type: String,
        enum: [
            "pending",
            "running",
            "paused",
            "completed",
        ],
        default: "pending",
    },

    places: [placeSchema],
    unresolvedPlaces: {
        type: [unresolvedPlaceSchema],
        default: [],
    },
    totalDistance: {
        type: Number,
        default: 0,
    },

    totalDuration: {
        type: Number,
        default: 0,
    },
    startLocation: {
        latitude: Number,
        longitude: Number,
    },
    startedAt: {
        type: Date,
        default: null,
    },

    completedAt: {
        type: Date,
        default: null,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("Tour", tourSchema);





// const mongoose = require("mongoose");


// const placeSchema = new mongoose.Schema({

//     searchQuery: {
//         type: String,
//         required: true,
//     },

//     name: String,

//     displayName: String,

//     latitude: Number,

//     longitude: Number,

//     address: String,

//     osmId: Number,

//     sequence: Number,

//     visited: {
//         type: Boolean,
//         default: false,
//     },

//     visitedAt: Date,

// }, { _id: true });


// const tourSchema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     description: {
//         type: String,
//         default: "",
//     },

//     status: {
//         type: String,
//         enum: [
//             "pending",
//             "running",
//             "paused",
//             "completed",
//         ],
//         default: "pending",
//     },

//     places: [placeSchema],

//     totalDistance: {
//         type: Number,
//         default: 0,
//     },

//     totalDuration: {
//         type: Number,
//         default: 0,
//     },

// }, {
//     timestamps: true,
// });

// module.exports = mongoose.model("Tour", tourSchema);









// const mongoose = require("mongoose");

// const placeSchema = new mongoose.Schema({

//     searchQuery: String,

//     name: String,

//     displayName: String,

//     osmId: Number,

//     latitude: Number,

//     longitude: Number,

//     address: String,

//     sequence: Number,

//     visited: {
//         type: Boolean,
//         default: false,
//     },

//     visitedAt: Date,

// }, { _id: true });

// const tourSchema = new mongoose.Schema({

//     searchQuery: {
//         type: String,
//         required: true,
//         unique: true,
//     },

//     status: {
//         type: String,
//         enum: [
//             "pending",
//             "running",
//             "paused",
//             "completed",
//         ],
//         default: "pending",
//     },

//     places: [placeSchema],

//     totalDistance: {
//         type: Number,
//         default: 0,
//     },

//     totalDuration: {
//         type: Number,
//         default: 0,
//     },

//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },

// });

// module.exports = mongoose.model("Tour", tourSchema);









// const mongoose = require("mongoose");

// const placeSchema = new mongoose.Schema(
//   {
//     searchQuery: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     displayName: {
//       type: String,
//       default: "",
//     },

//     osmId: {
//       type: Number,
//     },

//     latitude: {
//       type: Number,
//       required: true,
//     },

//     longitude: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       type: String,
//       default: "",
//     },

//     visited: {
//       type: Boolean,
//       default: false,
//     },

//     visitedAt: {
//       type: Date,
//       default: null,
//     },

//     order: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { _id: true }
// );

// const routeSchema = new mongoose.Schema(
//   {
//     from: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     to: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     distance: {
//       type: Number,
//       default: 0,
//     },

//     duration: {
//       type: Number,
//       default: 0,
//     },

//     geometry: {
//       type: Array,
//       default: [],
//     },
//   },
//   { _id: false }
// );

// const tourSchema = new mongoose.Schema(
//   {
//     searchQuery: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       index: true,
//     },

//     places: {
//       type: [placeSchema],
//       default: [],
//     },

//     routes: {
//       type: [routeSchema],
//       default: [],
//     },

//     totalDistance: {
//       type: Number,
//       default: 0,
//     },

//     totalDuration: {
//       type: Number,
//       default: 0,
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "running",
//         "paused",
//         "completed",
//       ],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Tour", tourSchema);
