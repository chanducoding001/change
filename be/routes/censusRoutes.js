// routes/censusRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const isAdmin = require("../middlewares/isAdmin");
const {uploadCsvController, getAllStates, getDistrictsByState, getVillagesBySubDistrict, getSubDistrictsByDistrict} = require("../controllers/censusController");
// const {uploadCsvController, getDataByState, getStates, getAllStates} = require("../controllers/censusController");


router.post(process.env.CENSUS_TAIL_URL,upload.single("file"),isAdmin,uploadCsvController);

router.get(process.env.CENSUS_GET_ALL_STATES_TAIL_URL, getAllStates);
router.get(process.env.CENSUS_GET_DISTRICTS_BY_STATE_TAIL_URL,getDistrictsByState);
router.get(process.env.CENSUS_GET_SUB_DIST_BY_STATE_DIST_TAIL_URL,getSubDistrictsByDistrict);
router.get(process.env.CENSUS_GET_VILLS_BY_STATE_DIST_SUB_DIST_TAIL_URL,getVillagesBySubDistrict);



module.exports = router;
// router.get(process.env.CENSUS_GET_ALL_STATES_TAIL_URL,getStates);
// router.get(process.env.CENSUS_GET_STATE_TAIL_URL,getDataByState);


