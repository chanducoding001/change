const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    dashboardFor: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dashboard", dashboardSchema);