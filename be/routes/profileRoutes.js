const express = require("express");
const { saveDashboardContent, updateDashboardContent, getAllUsers } = require("../controllers/dashboardController");
const { updateProfile, changePassword, getProfileController, removeProfilePhotoController } = require("../controllers/profileController");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();



router.get(process.env.ALL_USERS_TAIL_URL, isAdmin ,getAllUsers);
router.get(process.env.GET_PROFILE_TAIL_URL, getProfileController);
router.delete(process.env.REMOVE_CURRENT_PROFILE_PHOTO, removeProfilePhotoController);
router.put(process.env.UPDATE_PROFILE_TAIL_URL, updateProfile);
router.put(process.env.UPDATE_PASSWORD_TAIL_URL, changePassword);


module.exports = router;