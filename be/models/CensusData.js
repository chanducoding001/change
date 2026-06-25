// models/StateCensus.js

const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema(
  {
    villageCode: String,
    name: String,
    level: String,
    censusData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const subDistrictSchema =
  new mongoose.Schema(
    {
      subDistrictCode: String,
      name: String,
      level: String,
      censusData: {
        type:
          mongoose.Schema.Types.Mixed,
        default: {},
      },
      villages: [villageSchema],
    },
    { _id: false }
  );

const districtSchema =
  new mongoose.Schema(
    {
      districtCode: String,
      name: String,
      level: String,
      censusData: {
        type:
          mongoose.Schema.Types.Mixed,
        default: {},
      },
      subDistricts: [
        subDistrictSchema,
      ],
    },
    { _id: false }
  );

const stateSchema =
  new mongoose.Schema(
    {
      stateCode: {
        type: String,
        unique: true,
        required: true,
        index: true,
      },
      stateName: String,
      censusData: {
        type:
          mongoose.Schema.Types.Mixed,
        default: {},
      },
      districts: [
        districtSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "StateCensus",
    stateSchema
  );
