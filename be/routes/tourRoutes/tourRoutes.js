const express = require("express");

const router = express.Router();

const {
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
} = require("../../controllers/tourControllers/tourController");
const isAdmin = require("../../middlewares/isAdmin");

router.use(isAdmin);
// create tour
router.post(process.env.CREATE_TOUR_TAIL_URL, createTour);

// Search (Uses Mongo Cache → Nominatim → Save)
router.post("/search", searchTour);


// Get Tours
router.get(process.env.GET_ALL_TOURS_TAIL_URL, getAllTours);


// Get Single Tour
router.get(process.env.DELETE_TOUR_TAIL_URL, getTourById);


// Tour Status
router.put(process.env.START_TOUR_TAIL_URL, startTour);
router.put(process.env.SYNC_TOUR_TAIL_URL, syncTour);

router.put("/:tourId/pause", pauseTour);

router.put("/:tourId/resume", resumeTour);


// Current Location
router.post("/:tourId/current-location", updateCurrentLocation);


// Mark Place Visited
router.put("/:tourId/place/:placeId/visit", visitPlace);


// Add Place
router.post(process.env.ADD_PLACE_IN_TOUR_TAIL_URL, addPlace);


// Delete Place
router.delete("/:tourId/place/:placeId", deletePlace);


// Delete Tour
router.delete(process.env.DELETE_TOUR_TAIL_URL, deleteTour);


module.exports = router;
