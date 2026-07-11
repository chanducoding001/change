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
} = require("../../services/tourServices/tourNavigationService");

// Services (we'll create these next)
const {
  createTourFromSearch,
} = require("../../services/tourServices/nominatimService");
const {
  findNearestPlace,
} = require("../../services/tourServices/nearestPlaceService");

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

      status: "pending",

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

    return res.status(200).json({
      success: true,
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
 * Start Tour
 */
const startTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Current latitude and longitude are required.",
      });
    }

    const tour = await Tour.findById(tourId).populate("places.place");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found.",
      });
    }

    // if (tour.status === "running") {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Tour is already running.",
    //     });
    // }

    if (tour.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Tour has already been completed.",
      });
    }

    // Start Tour
    tour.status = "running";

    tour.startedAt = new Date();

    tour.startLocation = {
      latitude,
      longitude,
    };

    await tour.save();

    // Build Navigation Response
    const data = await getTourNavigationResponse({
      tour,
      currentLocation: {
        latitude,
        longitude,
      },
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

    const tour = await Tour.findById(tourId).populate("places.place");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    if (tour.status !== "running") {
      return res.status(400).json({
        success: false,
        message: "Tour is not running.",
      });
    }

    await updateVisitedPlaces({
      tour,
      currentLocation: { latitude, longitude },
    });

    const data = await getTourNavigationResponse({
      tour,
      currentLocation: { latitude, longitude },
    });

    return res.status(200).json({
      success: true,
      message: "Tour synchronized successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const startTour = async (req, res) => {
//     try {
//         const { tourId } = req.params;
//         const { latitude, longitude } = req.body;

//         if (!latitude || !longitude) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Current latitude and longitude are required.",
//             });
//         }

//         const tour = await Tour.findById(tourId).populate(
//             "places.place"
//         );

//         if (!tour) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Tour not found",
//             });
//         }

//         const navigation =
//             await buildNavigationRoute({
//                 tour,
//                 currentLocation: {
//                     latitude,
//                     longitude,
//                 },
//             });

//         tour.status = "running";

//         await tour.save();

//         return res.status(200).json({
//             success: true,
//             message: "Tour started successfully.",
//             data: navigation,
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// };

// const syncTour = async (req, res) => {
//     try {

//         const { tourId } = req.params;
//         const { latitude, longitude } = req.body;

//         if (
//             latitude === undefined ||
//             longitude === undefined
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Current latitude and longitude are required.",
//             });
//         }

//         const tour = await Tour.findById(tourId)
//             .populate("places.place");

//         if (!tour) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Tour not found.",
//             });
//         }

//         if (tour.status !== "running") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Tour is not running.",
//             });
//         }

//         // -------------------------------
//         // Update visited places
//         // -------------------------------

//         let visitSequence =
//             Math.max(
//                 0,
//                 ...tour.places.map(
//                     (p) => p.visitSequence || 0
//                 )
//             );

//         const VISIT_RADIUS = 100; // meters

//         for (const place of tour.places) {

//             if (place.visited) continue;

//             const distance =
//                 getDistanceBetweenCoordinates(
//                     latitude,
//                     longitude,
//                     place.place.latitude,
//                     place.place.longitude
//                 );

//             if (distance <= VISIT_RADIUS) {

//                 place.visited = true;
//                 place.visitedAt = new Date();
//                 place.visitSequence = ++visitSequence;

//             }

//         }

//         // -------------------------------
//         // Complete tour if everything visited
//         // -------------------------------

//         const completed =
//             tour.places.every(
//                 (place) => place.visited
//             );

//         if (completed) {

//             tour.status = "completed";
//             tour.completedAt = new Date();

//             await tour.save();

//             return res.status(200).json({
//                 success: true,
//                 message: "Tour completed successfully.",
//                 data: {
//                     status: tour.status,
//                     completed: true,
//                     remainingPlaces: [],
//                 },
//             });

//         }

//         await tour.save();

//         // -------------------------------
//         // Remaining places
//         // -------------------------------

//         const remainingPlaces =
//             tour.places.filter(
//                 (place) => !place.visited
//             );

//         // -------------------------------
//         // Build navigation
//         // -------------------------------

//         const navigation =
//             await buildNavigationRoute({
//                 currentLocation: {
//                     latitude,
//                     longitude,
//                 },
//                 places: remainingPlaces,
//             });

//         return res.status(200).json({
//             success: true,
//             message: "Tour synchronized successfully.",
//             data: {
//                 status: tour.status,
//                 completed: false,
//                 currentLocation: {
//                     latitude,
//                     longitude,
//                 },
//                 remainingPlaces:
//                     navigation.remainingPlaces,
//             },
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// };

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

    const placesToOptimize = [...tour.places.map((item) => item.place), place];

    const optimized = await optimizeTour(placesToOptimize);

    /**
     * Replace tour places
     */

    tour.places = optimized.optimizedPlaces.map((place, index) => ({
      place: place._id,

      sequence: index + 1,

      distanceFromPrevious:
        index === 0 ? 0 : optimized.legs[index - 1].distance,

      visited: false,

      visitedAt: null,
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

// const addPlace = async (req, res) => {

//     try {

//         const { tourId } = req.params;
//         const { searchQuery } = req.body;

//         const tour = await Tour.findById(tourId);

//         if (!tour) {

//             return res.status(404).json({
//                 success: false,
//                 message: "Tour not found",
//             });

//         }

//         const response = await axios.get(
//             "https://nominatim.openstreetmap.org/search",
//             {
//                 params: {
//                     q: searchQuery,
//                     format: "jsonv2",
//                     limit: 1,
//                 },
//                 headers: {
//                     "User-Agent": "GIS-Tour-Optimizer/1.0",
//                 },
//             }
//         );

//         if (!response.data.length) {

//             return res.status(404).json({
//                 success: false,
//                 message: "Place not found",
//             });

//         }

//         const place = response.data[0];

//         tour.places.push({

//             searchQuery,

//             name:
//                 place.display_name.split(",")[0],

//             displayName:
//                 place.display_name,

//             osmId:
//                 place.osm_id,

//             latitude:
//                 Number(place.lat),

//             longitude:
//                 Number(place.lon),

//             address:
//                 place.display_name,

//             visited: false,

//             visitedAt: null,

//         });

//         const optimized =
//             await optimizeTour(
//                 tour.places
//             );

//         tour.places =
//             optimized.places;

//         tour.routes =
//             optimized.routes;

//         tour.totalDistance =
//             optimized.totalDistance;

//         tour.totalDuration =
//             optimized.totalDuration;

//         await tour.save();

//         return res.json({
//             success: true,
//             data: tour,
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }

// };

/**
 * Delete Place
 */
const deletePlace = async (req, res) => {
  try {
    const { tourId, placeId } = req.params;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    tour.places = tour.places.filter(
      (place) => place._id.toString() !== placeId,
    );

    const optimized = await optimizeTour(tour.places);

    tour.places = optimized.places;

    tour.routes = optimized.routes;

    tour.totalDistance = optimized.totalDistance;

    tour.totalDuration = optimized.totalDuration;

    await tour.save();

    return res.json({
      success: true,
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
};
