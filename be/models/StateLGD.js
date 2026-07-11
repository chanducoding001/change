const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema(
  {
    villageCode: {
      type: String,
      index: true,
    },
    villageName: String,
    level: {
      type: String,
      default: "Village",
    },
  },
  { _id: false }
);

const subDistrictSchema = new mongoose.Schema(
  {
    subDistrictCode: {
      type: String,
      index: true,
    },
    subDistrictName: String,
    level: {
      type: String,
      default: "Sub District",
    },
    villages: [villageSchema],
  },
  { _id: false }
);

const districtSchema = new mongoose.Schema(
  {
    districtCode: {
      type: String,
      index: true,
    },
    districtName: String,
    level: {
      type: String,
      default: "District",
    },
    subDistricts: [subDistrictSchema],
  },
  { _id: false }
);

const stateSchema = new mongoose.Schema(
  {
    stateCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stateName: String,

    level: {
      type: String,
      default: "State",
    },

    districts: [districtSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StateLGD",
  stateSchema
);
