const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const isAdmin = require("../middlewares/isAdmin");
const {uploadLGDCsvController,
  getAllLGDStates,
  getDistrictsByStateLGD,
  getSubDistrictsByDistrictLGD,
  getVillagesBySubDistrictLGD,} = require("../controllers/stateD_SD_V_Controller");


router.post(process.env.CENSUS_TAIL_URL,upload.single("file"),isAdmin,uploadLGDCsvController);

router.get(process.env.CENSUS_GET_ALL_STATES_TAIL_URL, getAllLGDStates);
router.get(process.env.CENSUS_GET_DISTRICTS_BY_STATE_TAIL_URL,getDistrictsByStateLGD);
router.get(process.env.CENSUS_GET_SUB_DIST_BY_STATE_DIST_TAIL_URL,getSubDistrictsByDistrictLGD);
router.get(process.env.CENSUS_GET_VILLS_BY_STATE_DIST_SUB_DIST_TAIL_URL,getVillagesBySubDistrictLGD);





module.exports = router;
