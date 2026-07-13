const axios = require("axios");
const Tour = require("../../models/tourModel/Tour");
const {
  optimizeTour,
} = require("../../services/tourServices/tourOptimizerService");
const { searchPlace } = require("../../services/tourServices/nominatimService");
const {
  findOrCreatePlace,
} = require("../../services/tourServices/placeService");
const {
  buildNavigationRoute,
  getTourNavigationResponse,
  updateVisitedPlaces,
  getRoute,
  haversineDistance,
  normalizeCoordinate,
  reverseGeocode,
} = require("../../services/tourServices/tourNavigationService");

// Services (we'll create these next)
const {
  createTourFromSearch,
} = require("../../services/tourServices/nominatimService");
const {
  findNearestPlace,
} = require("../../services/tourServices/nearestPlaceService");
// const { reverseGeocode } = require("../../services/tourServices/reverseGeoCode");
// const reverseGeocode = require("../../services/tourServices/reverseGeocode");

const tourStates = {
  PENDING:'pending',
  RUNNING:'running',
  COMPLETED:'completed'
}
// create tour

const createTour = async (req, res) => {
  try {
    const {
      name,

      description = "",

      places = [],
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,

        message: "Tour name is required",
      });
    }

    // if (!Array.isArray(places) || !places.length) {

    //     return res.status(400).json({

    //         success: false,

    //         message: "At least one place is required",

    //     });

    // }
    if (!Array.isArray(places) || places.length === 0) {
      const tour = await Tour.create({
        name: name.trim(),
        description: description.trim(),
        status: "pending",
        places: [],
        unresolvedPlaces: [],
        totalDistance: 0,
        remainingDistance: 0,
      });

      return res.status(201).json({
        success: true,
        message: "Tour created successfully.",
        data: tour,
      });
    }
    const uniquePlaces = [
      ...new Map(
        places.map((place) => [place.searchQuery.trim().toLowerCase(), place]),
      ).values(),
    ];

    const resolvedPlaces = [];

    const unresolvedPlaces = [];

    for (const item of uniquePlaces) {
      if (!item.searchQuery?.trim()) {
        continue;
      }

      const place = await findOrCreatePlace(item.searchQuery);

      if (!place) {
        unresolvedPlaces.push({
          searchQuery: item.searchQuery,

          reason: "Location not found",
        });

        continue;
      }

      resolvedPlaces.push(place);
    }

    if (!resolvedPlaces.length) {
      return res.status(400).json({
        success: false,

        message: "No valid places found",
      });
    }

    const optimized = await optimizeTour(resolvedPlaces);

    const tourPlaces = optimized.optimizedPlaces.map((place, index) => ({
      place: place._id,

      sequence: index + 1,

      distanceFromPrevious:
        index === 0 ? 0 : optimized.legs[index - 1].distance,

      visited: false,

      visitedAt: null,
    }));

    const tour = await Tour.create({
      name: name.trim(),

      description: description.trim(),

      status: tourStates.PENDING,
      // status: "pending",

      places: tourPlaces,

      unresolvedPlaces,

      totalDistance: optimized.totalDistance,

      remainingDistance: optimized.totalDistance,
    });

    const createdTour = await Tour.findById(tour._id).populate("places.place");

    return res.status(201).json({
      success: true,

      message: "Tour created successfully",

      data: createdTour,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// const createTour = async (req, res) => {

//     try {

//         const {
//             name,
//             description = "",
//             places = [],
//         } = req.body;

//         // Validation
//         if (!name?.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Tour name is required",
//             });
//         }

//         if (!Array.isArray(places) || places.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "At least one place is required",
//             });
//         }

//         /**
//          * Remove duplicate search queries
//          */
//         const uniquePlaces = [
//             ...new Map(
//                 places.map(place => [
//                     place.searchQuery.trim().toLowerCase(),
//                     place,
//                 ])
//             ).values(),
//         ];

//         /**
//          * Resolve Places
//          */
//         const resolvedPlaces = [];

//         for (const item of uniquePlaces) {

//             if (!item.searchQuery?.trim()) {
//                 continue;
//             }

//             const place = await findOrCreatePlace(
//                 item.searchQuery
//             );

//             if (!place) {

//                 console.log(
//                     `${item.searchQuery} not found`
//                 );

//                 continue;
//             }

//             resolvedPlaces.push(place);
//         }

//         if (!resolvedPlaces.length) {

//             return res.status(400).json({
//                 success: false,
//                 message: "No valid places found.",
//             });

//         }

//         /**
//          * Optimize Tour
//          */
//         const optimizedPlaces =
//             await optimizeTour(resolvedPlaces);

//         /**
//          * Build Tour Places
//          */
//         const tourPlaces =
//             optimizedPlaces.map((place, index) => ({

//                 place: place._id,

//                 sequence: index + 1,

//                 visited: false,

//                 visitedAt: null,

//             }));

//         /**
//          * Create Tour
//          */
//         const tour = await Tour.create({

//             name: name.trim(),

//             description: description.trim(),

//             status: "pending",

//             places: tourPlaces,

//         });

//         /**
//          * Populate Places
//          */
//         const createdTour =
//             await Tour.findById(tour._id)
//                 .populate("places.place");

//         return res.status(201).json({

//             success: true,

//             message: "Tour created successfully.",

//             data: createdTour,

//         });

//     }
//     catch (error) {

//         console.error(error);

//         return res.status(500).json({

//             success: false,

//             message: error.message,

//         });

//     }

// };

/**
 * Search Tour
 *
 * Flow:
 * 1. Check MongoDB
 * 2. If exists → return cached tour
 * 3. Else → Call Nominatim
 * 4. Save Tour
 * 5. Return Tour
 */
const searchTour = async (req, res) => {
  try {
    const { searchQuery } = req.body;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "searchQuery is required",
      });
    }

    // Check cache
    const existingTour = await Tour.findOne({
      searchQuery: searchQuery.trim(),
    });

    if (existingTour) {
      return res.status(200).json({
        success: true,
        cached: true,
        message: "Tour loaded from database",
        data: existingTour,
      });
    }

    // Create a new tour using Nominatim
    const newTour = await createTourFromSearch(searchQuery);

    return res.status(201).json({
      success: true,
      cached: false,
      message: "Tour created successfully",
      data: newTour,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Tours
 */

const getAllTours = async (req, res) => {
  try {
    // const tours = await Tour.find()
    // .select(
    //     "searchQuery totalDistance totalDuration status createdAt places"
    // )
    // .sort({
    //     createdAt: -1,
    // });
    const tours = await Tour.find()
      .populate("places.place")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,

      count: tours.length,

      data: tours,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Get Tour By Id
 */

const getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId).populate({
      path: "places.place",
      model: "Place",
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // return res.status(200).json({
    //   success: true,
    //   data: tour,
    // });
    const isTourCompleted =
            tour.places.length > 0 &&
            tour.places.every(place => place.visited);

        return res.status(200).json({
            success: true,
            data: {
                ...tour.toObject(),
                isTourCompleted,
            },
        });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Start Tour
 */

const startTour = async (req, res) => {
    try {

        const { tourId } = req.params;
        const { latitude, longitude } = req.body;

        if (latitude == null || longitude == null) {
            return res.status(400).json({
                success: false,
                message: "Current latitude and longitude are required.",
            });
        }

        const tour = await Tour.findById(tourId)
            .populate("places.place");

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found.",
            });
        }

        // if (tour.status === "completed") {
        if (tour.status === tourStates.COMPLETED) {
            return res.status(400).json({
                success: false,
                message: "Tour has already been completed.",
            });
        }

        // Reset tour state if restarting
        tour.places.forEach((place) => {
            place.visited = false;
            place.visitedAt = null;
            place.visitSequence = null;
        });

        // tour.status = "running";
        tour.status = tourStates.RUNNING;
        tour.startedAt = new Date();
        tour.completedAt = null;

        // Save actual GPS start location
        const startLocation = await reverseGeocode({
            latitude,
            longitude,
        });

        tour.startLocation = {
    ...startLocation,
    latitude,
    longitude,
};

        // Reset progress
        tour.visitedTotalDistanceFromStartLocation = 0;
        tour.actualTravelledDistance = 0;

        // Used for travelled distance calculation in syncTour
        tour.lastSyncedLocation = {
            latitude,
            longitude,
        };

        // ---------------------------------------------
        // Calculate total distance from actual start
        // ---------------------------------------------
        let totalDistance = 0;

        let previous = {
            latitude,
            longitude,
        };

        for (const item of tour.places) {

            const current = {
                latitude: item.place.latitude,
                longitude: item.place.longitude,
            };

            const route = await getRoute({
                startLocation: previous,
                endLocation: current,
            });

            item.distanceFromPrevious = route.distance;

            totalDistance += route.distance;

            previous = current;
        }

        tour.actualTotalDistanceFromStartLocation = totalDistance;

        await tour.save();

        const data = await getTourNavigationResponse({
            tour,
            currentLocation: {
                latitude,
                longitude,
            },
            reroute: true,
        });

        return res.status(200).json({
            success: true,
            message: "Tour started successfully.",
            data,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// sync tour

const syncTour = async (req, res) => {

    try {

        const { tourId } = req.params;
        const { latitude, longitude } = req.body;

        if (latitude == null || longitude == null) {

            return res.status(400).json({
                success: false,
                message: "Current latitude and longitude are required.",
            });

        }

        const tour = await Tour.findById(tourId)
            .populate("places.place");

        if (!tour) {

            return res.status(404).json({
                success: false,
                message: "Tour not found.",
            });

        }

        // if (tour.status !== "running") {
        if (tour.status !== tourStates.RUNNING) {

            return res.status(400).json({
                success: false,
                message: "Tour is not running.",
            });

        }

        const currentLocation = {
          latitude,
          longitude
        }
/*
 * --------------------------------------------------
 * Actual travelled distance (GPS movement)
 * --------------------------------------------------
 */
// console.log("tour.lastSyncedLocation", tour.lastSyncedLocation);
// console.log("latitude", latitude);
// console.log("longitude", longitude);

// const previousLocation = {
//     latitude: normalizeCoordinate(tour.lastSyncedLocation.latitude),
//     longitude: normalizeCoordinate(tour.lastSyncedLocation.longitude),
// };

// const current = {
//     latitude: normalizeCoordinate(latitude),
//     longitude: normalizeCoordinate(longitude),
// };

// if (
//     previousLocation.latitude !== current.latitude ||
//     previousLocation.longitude !== current.longitude
// ) {
//     const travelledDistance = haversineDistance(
//         previousLocation.latitude,
//         previousLocation.longitude,
//         current.latitude,
//         current.longitude
//     );
//     if(travelledDistance>10){
//       tour.actualTravelledDistance += travelledDistance;
//       tour.lastSyncedLocation = {
//         latitude,
//         longitude,
//     };
//     }
// } 
// else {
//     // First sync after starting the tour
//     tour.lastSyncedLocation = {
//         latitude,
//         longitude,
//     };
// }

if (
    tour.lastSyncedLocation &&
    tour.lastSyncedLocation.latitude != null &&
    tour.lastSyncedLocation.longitude != null
) {
    const previousLocation = {
        latitude: normalizeCoordinate(tour.lastSyncedLocation.latitude),
        longitude: normalizeCoordinate(tour.lastSyncedLocation.longitude),
    };

    const current = {
        latitude: normalizeCoordinate(latitude),
        longitude: normalizeCoordinate(longitude),
    };

    if (
        previousLocation.latitude !== current.latitude ||
        previousLocation.longitude !== current.longitude
    ) {
        const travelledDistance = haversineDistance(
            previousLocation.latitude,
            previousLocation.longitude,
            current.latitude,
            current.longitude
        );

        if (travelledDistance > 10) {
            tour.actualTravelledDistance += travelledDistance;
            tour.lastSyncedLocation = {
                latitude,
                longitude,
            };
        }
    }
} else {
    // First sync
    tour.lastSyncedLocation = {
        latitude,
        longitude,
    };
}
    //     tour.lastSyncedLocation = {
    //     latitude,
    //     longitude,
    // };
        /*
         * --------------------------------------------------
         * Save latest GPS
         * --------------------------------------------------
         */


        /*
         * --------------------------------------------------
         * Mark visited places
         * --------------------------------------------------
         */

        await updateVisitedPlaces({
            tour,
            currentLocation,
        });

        /*
         * --------------------------------------------------
         * Build navigation response
         * (findNextPlace is called internally)
         * --------------------------------------------------
         */

        const data =
            await getTourNavigationResponse({
                tour,
                currentLocation,
            });

        /*
         * --------------------------------------------------
         * Save everything
         * --------------------------------------------------
         */

        await tour.save();

        return res.status(200).json({

            success: true,

            message:
                // tour.status === "completed"
                tour.status === tourStates.COMPLETED
                    ? "Tour completed successfully."
                    : "Tour synchronized successfully.",

            data,

        });

    } catch (error) {
        console.log('error',error.message);
        
        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


/**
 * Pause Tour
 */
const pauseTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,

        message: "Tour not found",
      });
    }

    tour.status = "paused";

    await tour.save();

    return res.status(200).json({
      success: true,

      message: "Tour paused",

      data: tour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Resume Tour
 */
const resumeTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,

        message: "Tour not found",
      });
    }

    tour.status = "running";

    await tour.save();

    return res.status(200).json({
      success: true,

      message: "Tour resumed",

      data: tour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Receive Current Location
 * Find nearest place
 */

const updateCurrentLocation = async (req, res) => {
  try {
    const { tourId } = req.params;

    const { latitude, longitude } = req.body;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const result = await findNearestPlace(latitude, longitude, tour.places);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Mark Place Visited
 */
const visitPlace = async (req, res) => {
  try {
    const { tourId, placeId } = req.params;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const place = tour.places.id(placeId);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    place.visited = true;
    place.visitedAt = new Date();

    const completed = tour.places.every((p) =>
      p._id.equals(placeId) ? true : p.visited,
    );

    if (completed) {
      tour.status = "completed";
    }

    await tour.save();

    return res.json({
      success: true,
      message: "Place visited",
      data: tour,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add Place
 */

const addPlace = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { searchQuery } = req.body;

    if (!searchQuery?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const tour = await Tour.findById(tourId).populate("places.place");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    /**
     * Resolve Place
     */

    const place = await findOrCreatePlace(searchQuery);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    /**
     * Prevent duplicate places
     */

    const alreadyExists = tour.places.some(
      (item) => item.place._id.toString() === place._id.toString(),
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Place already exists in this tour",
      });
    }

    /**
     * Build list for optimization
     */

    // const placesToOptimize = [...tour.places.map((item) => item.place), place];
    const placesToOptimize = [
    ...tour.places.map(item => item.place),
    place,
];

    // const optimized = await optimizeTour(placesToOptimize);

    // tour.places = optimized.optimizedPlaces.map((place, index) => ({
    //   place: place._id,

    //   sequence: index + 1,

    //   distanceFromPrevious:
    //     index === 0 ? 0 : optimized.legs[index - 1].distance,

    //   visited: false,

    //   visitedAt: null,
    // }));
    const optimized = await optimizeTour(placesToOptimize);

tour.places = optimized.optimizedPlaces.map((place, index) => ({
    place: place._id,
    sequence: index + 1,
    distanceFromPrevious:
        index === 0
            ? 0
            : optimized.legs[index - 1].distance,
    visited: false,
    visitedAt: null,
    visitSequence: null,
}));

    tour.totalDistance = optimized.totalDistance;

    await tour.save();

    const updatedTour = await Tour.findById(tour._id).populate("places.place");

    return res.status(200).json({
      success: true,

      message: "Place added successfully",

      data: updatedTour,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};


/**
 * Delete Place
 */
const deletePlace = async (req, res) => {
    try {

        const { tourId, placeId } = req.params;

        const tour = await Tour.findById(tourId)
            .populate("places.place");

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found.",
            });
        }

        if (tour.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed tour cannot be modified.",
            });
        }

        const placeIndex = tour.places.findIndex(
            item => item._id.toString() === placeId
        );

        if (placeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Place not found in the tour.",
            });
        }

        const deletedPlace = tour.places[placeIndex];

        // Remove the place
        tour.places.splice(placeIndex, 1);

        /*
         * ----------------------------------------
         * Pending Tour
         * Re-optimize remaining places
         * ----------------------------------------
         */
        if (tour.status === "pending") {

            const placesToOptimize = tour.places.map(
                item => item.place
            );

            const optimized = await optimizeTour(
                placesToOptimize
            );

            tour.places = optimized.optimizedPlaces.map(
                (place, index) => ({
                    place: place._id,
                    sequence: index + 1,
                    distanceFromPrevious:
                        index === 0
                            ? 0
                            : optimized.legs[index - 1].distance,
                    visited: false,
                    visitedAt: null,
                    visitSequence: null,
                })
            );

            tour.totalDistance = optimized.totalDistance;
            tour.totalDuration = 0; // or optimized.totalDuration if you calculate it
        }

        /*
         * ----------------------------------------
         * Running / Paused Tour
         * Keep existing order
         * ----------------------------------------
         */
        else {

            if (
                tour.currentNextPlace &&
                deletedPlace.place._id.equals(
                    tour.currentNextPlace
                )
            ) {
                tour.currentNextPlace = null;
            }

            tour.places.forEach((item, index) => {
                item.sequence = index + 1;
            });

        }

        await tour.save();

        const updatedTour = await Tour.findById(tour._id)
            .populate("places.place");

        return res.status(200).json({
            success: true,
            message: "Place deleted successfully.",
            data: updatedTour,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



/**
 * Delete Tour
 */
const deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const deleted = await Tour.findByIdAndDelete(tourId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return res.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete unresolved places from tour

const deleteUnresolvedPlace = async (req, res) => {
    try {

        const { tourId } = req.params;
        const { searchQuery } = req.body;

        if (!searchQuery?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required.",
            });
        }

        const tour = await Tour.findById(tourId);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found.",
            });
        }

        const placeIndex = tour.unresolvedPlaces.findIndex(
            place =>
                place.searchQuery.toLowerCase().trim() ===
                searchQuery.toLowerCase().trim()
        );

        if (placeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Unresolved place not found.",
            });
        }

        tour.unresolvedPlaces.splice(placeIndex, 1);

        await tour.save();

        return res.status(200).json({
            success: true,
            message: "Unresolved place deleted successfully.",
            data: tour.unresolvedPlaces,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
  createTour,

  searchTour,

  getAllTours,

  getTourById,

  startTour,

  syncTour,

  pauseTour,

  resumeTour,

  updateCurrentLocation,

  visitPlace,

  addPlace,

  deletePlace,

  deleteTour,

  deleteUnresolvedPlace
};



// const deletePlace = async (req, res) => {
//     try {

//         const { tourId, placeId } = req.params;

//         const tour = await Tour.findById(tourId)
//     .populate("places.place");

//         if (!tour) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Tour not found.",
//             });
//         }

//         if (tour.status === "completed") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Completed tour cannot be modified.",
//             });
//         }

//         const placeIndex = tour.places.findIndex(
//             place => place._id.toString() === placeId
//         );

//         if (placeIndex === -1) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Place not found in the tour.",
//             });
//         }

//         const deletedPlace = tour.places[placeIndex];

//         // Remove the place
//         tour.places.splice(placeIndex, 1);

//         /*
//          * ----------------------------------------
//          * Pending Tour
//          * Re-optimize the tour
//          * ----------------------------------------
//          */
//         if (tour.status === "pending") {

//             const optimized = await optimizeTour(tour.places);

//             tour.places = optimized.places;
//             tour.totalDistance = optimized.totalDistance;
//             tour.totalDuration = optimized.totalDuration;
//         }

//         /*
//          * ----------------------------------------
//          * Running / Paused Tour
//          * Keep existing order
//          * ----------------------------------------
//          */
//         if (
//             tour.status === "running" ||
//             tour.status === "paused"
//         ) {

//             // Reset current target if it was deleted
//             if (
//                 tour.currentNextPlace &&
//                 deletedPlace.place.equals(tour.currentNextPlace)
//             ) {
//                 tour.currentNextPlace = null;
//             }

//             // Re-sequence remaining places
//             tour.places.forEach((place, index) => {
//                 place.sequence = index + 1;
//             });
//         }

//         await tour.save();

//         return res.status(200).json({
//             success: true,
//             message: "Place deleted successfully.",
//             data: tour,
//         });

//     } catch (error) {
//         console.log(error.response?.status);
//         console.log(error.response?.data);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// };



// const deletePlace = async (req, res) => {
//   try {
//     const { tourId, placeId } = req.params;

//     const tour = await Tour.findById(tourId);

//     if (!tour) {
//       return res.status(404).json({
//         success: false,
//         message: "Tour not found",
//       });
//     }

//     tour.places = tour.places.filter(
//       (place) => place._id.toString() !== placeId,
//     );

//     const optimized = await optimizeTour(tour.places);

//     tour.places = optimized.places;

//     tour.routes = optimized.routes;

//     tour.totalDistance = optimized.totalDistance;

//     tour.totalDuration = optimized.totalDuration;

//     await tour.save();

//     return res.json({
//       success: true,
//       data: tour,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };