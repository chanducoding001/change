const mongoose = require("mongoose");

const dashboardContentSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DashboardContent", dashboardContentSchema);