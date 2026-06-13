const express = require("express");
const router = express.Router();

const {
  createDashboard,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
  setDefaultDashboard,
  getCurrentDashboard,
  getDashboards,
} = require("../controllers/dashboardController");
const isAdmin = require("../middlewares/isAdmin");

// Create Dashboard
router.post(process.env.CREATE_DASHBOARD_TAIL_URL,isAdmin, createDashboard);

// Get All Admin/User Dashboards
router.get(process.env.GET_ALL_DASHBOARDS_TAIL_URL,isAdmin, getDashboards);

// Get One Dashboard
router.get(process.env.GET_ONE_DASHBOARD_TAIL_URL, getDashboardById);

// Update Dashboard
router.put(process.env.UPDATE_DASHBOARD_TAIL_URL,isAdmin, updateDashboard);

// Delete Dashboard
router.delete(process.env.DELETE_DASHBOARD_TAIL_URL,isAdmin, deleteDashboard);

// Set Dashboard As Main
router.put(process.env.SET_MAIN_DASHBOARD_TAIL_URL,isAdmin, setDefaultDashboard);

// Get Current Main Dashboard For Role
router.get(process.env.GET_CURRENT_MAIN_DASHBOARD_TAIL_URL, getCurrentDashboard);

module.exports = router;