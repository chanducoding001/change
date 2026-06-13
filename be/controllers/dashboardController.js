const DashboardContent = require("../models/DashboardContent");
const User = require('../models/User');
const Dashboard = require("../models/Dashboard");


const createDashboard = async (req, res) => {
  try {
    const { title, content, dashboardFor } = req.body;

    // Required field validation
    // if (!title || !title.trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title is required",
    //   });
    // }

    // if (!content || !content.trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Content is required",
    //   });
    // }

    if (!dashboardFor) {
      return res.status(400).json({
        success: false,
        message: "Dashboard type is required",
      });
    }

    // Min length validation
    // if (title.trim().length < 5) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title must be at least 5 characters long",
    //   });
    // }

    // if (content.trim().length < 20) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Content must be at least 20 characters long",
    //   });
    // }

    // Dashboard type validation
    const allowedDashboardTypes = ["admin", "user"];

    if (!allowedDashboardTypes.includes(dashboardFor)) {
      return res.status(400).json({
        success: false,
        message: "Dashboard type must be either admin or user",
      });
    }

    const dashboard = await Dashboard.create({
      title: title?.trim(),
      content: content?.trim(),
      dashboardFor,
    });

    res.status(201).json({
      success: true,
      message: "Dashboard created successfully",
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getDashboards = async (req, res) => {
  try {
    const { role } = req.params;

    // const query = role ? { dashboardFor: role } : {};

    const dashboards = await Dashboard.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: dashboards.length,
      data: dashboards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardById = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(
      req.params.id
    );

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDashboard = async (req, res) => {
  try {
    const { title, content } = req.body;

    const dashboard =
      await Dashboard.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dashboard updated successfully",
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const setDefaultDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(
      req.params.id
    );

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    await Dashboard.updateMany(
      {
        dashboardFor: dashboard.dashboardFor,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    dashboard.isDefault = true;
    await dashboard.save();

    res.status(200).json({
      success: true,
      message: `${dashboard.dashboardFor} default dashboard updated`,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    if (dashboard.isDefault) {
      return res.status(400).json({
        success: false,
        message:
          "Default dashboard cannot be deleted. Please set another dashboard as default first.",
      });
    }

    await dashboard.deleteOne();

    res.status(200).json({
      success: true,
      message: "Dashboard deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentDashboard = async (
  req,
  res
) => {
  try {
    const { role } = req.params;

    const dashboard =
      await Dashboard.findOne({
        dashboardFor: role,
        isDefault: true,
      });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message:
          "No default dashboard configured",
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
  { role: "user" },
  { password: 0 }
);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};



module.exports = { createDashboard,
  getDashboards, 
  getDashboardById,updateDashboard, deleteDashboard,setDefaultDashboard,getCurrentDashboard,
  getAllUsers };
