const fs = require("fs");
const { parse } = require("csv-parse");
const BSON = require("bson");
const StateLGD = require("../models/StateLGD");

const uploadLGDCsvController = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    filePath = req.file.path;

    const districtMap = new Map();

    let stateCode = "";
    let stateName = "";
    let rowCount = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          parse({
            columns: true,
            bom: true,
            trim: true,
            skip_empty_lines: true,
            relax_quotes: true,
            relax_column_count: true,
          })
        )
        .on("data", (row) => {
          rowCount++;

          const currentStateCode = row["state_code"]?.toString().trim();
          const currentStateName = row["state_name"]?.toString().trim();

          const districtCode = row["district_code"]?.toString().trim();
          const districtName = row["district_name"]?.toString().trim();

          const subDistrictCode = row["sub-district_code"]?.toString().trim();
          const subDistrictName = row["sub-district_name"]?.toString().trim();

          const villageCode = row["village_code"]?.toString().trim();
          const villageName = row["village_name"]?.toString().trim();

          if (!stateCode) stateCode = currentStateCode;
          if (!stateName) stateName = currentStateName;

          if (!districtCode) return;

          // ---------------- DISTRICT ----------------

          if (!districtMap.has(districtCode)) {
            districtMap.set(districtCode, {
              districtCode,
              districtName,
              level: "District",
              subDistrictMap: new Map(),
              subDistricts: [],
            });
          }

          const district = districtMap.get(districtCode);

          // ---------------- SUB DISTRICT ----------------

          if (
            subDistrictCode &&
            !district.subDistrictMap.has(subDistrictCode)
          ) {
            district.subDistrictMap.set(subDistrictCode, {
              subDistrictCode,
              subDistrictName,
              level: "Sub District",
              villageMap: new Map(),
              villages: [],
            });
          }

          if (!subDistrictCode) return;

          const subDistrict =
            district.subDistrictMap.get(subDistrictCode);

          // ---------------- VILLAGE ----------------

          if (
            villageCode &&
            !subDistrict.villageMap.has(villageCode)
          ) {
            subDistrict.villageMap.set(villageCode, {
              villageCode,
              villageName,
              level: "Village",
            });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (!stateCode) {
      return res.status(400).json({
        success: false,
        message: "No valid data found in CSV.",
      });
    }

    const exists = await StateLGD.exists({
      stateCode,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: `State ${stateCode} already exists.`,
      });
    }

    const stateData = {
      stateCode,
      stateName,
      level: "State",
      districts: [],
    };

    let districtCount = 0;
    let subDistrictCount = 0;
    let villageCount = 0;

    districtMap.forEach((district) => {
      district.subDistrictMap.forEach((subDistrict) => {
        subDistrict.villages = Array.from(
          subDistrict.villageMap.values()
        );

        villageCount += subDistrict.villages.length;
        subDistrictCount++;

        delete subDistrict.villageMap;

        district.subDistricts.push(subDistrict);
      });

      delete district.subDistrictMap;

      districtCount++;

      stateData.districts.push(district);
    });
        const size = BSON.calculateObjectSize(stateData);

    const sizeMB = (
      size /
      1024 /
      1024
    ).toFixed(2);

    console.log(
      `Document Size: ${sizeMB} MB`
    );

    if (size > 16 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: `Document size (${sizeMB} MB) exceeds MongoDB's 16 MB limit.`,
      });
    }

    const saved = await StateLGD.create(stateData);

    return res.status(201).json({
      success: true,
      message: "LGD hierarchy uploaded successfully.",
      stateCode: saved.stateCode,
      stateName: saved.stateName,
      rows: rowCount,
      districts: districtCount,
      subDistricts: subDistrictCount,
      villages: villageCount,
      sizeMB,
    });

  } catch (err) {
    console.error(
      "LGD Upload Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to process CSV",
    });

  } finally {
    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error(
          "Cleanup Error:",
          e
        );
      }
    }
  }
};

const getAllLGDStates = async (req, res) => {
  try {
    const states = await StateLGD.find()
      .select("stateCode stateName")
      .sort({ stateName: 1 })
      .lean();

    const data = states.map((state) => ({
      id: state._id,
      stateCode: state.stateCode,
      state_name: state.stateName,
      label: state.stateName,
      value: state.stateName
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Get LGD States Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDistrictsByStateLGD = async (req, res) => {
  try {
    const { stateCode } = req.params;

    const state = await StateLGD.findOne({
      stateCode,
    })
      .select("districts")
      .lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const data = state.districts.map((district) => ({
      id: district.districtCode,
      districtCode: district.districtCode,
      district_name: district.districtName,
      label: district.districtName,
      value: district.districtName,
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(
      "Get Districts Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to fetch districts.",
    });
  }
};

const getSubDistrictsByDistrictLGD = async (req, res) => {
  try {
    const { stateCode, districtCode } = req.params;

    const state = await StateLGD.findOne({
      stateCode,
    })
      .select("districts")
      .lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const district = state.districts.find(
      (d) => d.districtCode === districtCode
    );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    const data = district.subDistricts.map((subDistrict) => ({
      id: subDistrict.subDistrictCode,
      subDistrictCode: subDistrict.subDistrictCode,
      sub_district_name: subDistrict.subDistrictName,
      label: subDistrict.subDistrictName,
      value: subDistrict.subDistrictName,
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(
      "Get Sub Districts Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to fetch sub districts.",
    });
  }
};

const getVillagesBySubDistrictLGD = async (req, res) => {
  try {
    const {
      stateCode,
      districtCode,
      subDistrictCode,
    } = req.params;

    const state = await StateLGD.findOne({
      stateCode,
    })
    .select("stateName stateCode districts")
    //   .select("districts")
      .lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const district = state.districts.find(
      (district) =>
        district.districtCode === districtCode
    );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    const subDistrict =
      district.subDistricts.find(
        (subDistrict) =>
          subDistrict.subDistrictCode ===
          subDistrictCode
      );

    if (!subDistrict) {
      return res.status(404).json({
        success: false,
        message: "Sub District not found",
      });
    }
    // console.log('state',state);
    
    const data = subDistrict.villages.map(
      (village,index) => {
        if(index===0){
            console.log('state',state);
        }
        return {
        id: village.villageCode,
        state_name: state.stateName,
        state_code: state.stateCode,
        district_code: district.districtCode,
        sub_district_code: subDistrict.subDistrictCode,
        district_name: district.districtName,
        sub_district_name: subDistrict.subDistrictName,
        village_name: village.villageName,
        village_code: village.villageCode,
        label: village.villageName,
        value: village.villageName,
      }
      }
    );
    // const data = subDistrict.villages.map(
    //   (village) => ({
    //     id: village.villageCode,
    //     state_name: state.stateName,
    //     district_name: district.districtName,
    //     sub_district_name: subDistrict.subDistrictName,
    //     village_name: village.villageName,
    //     village_code: village.villageCode,
    //     label: village.villageName,
    //     value: village.villageName,
    //   })
    // );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(
      "Get Villages Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to fetch villages.",
    });
  }
};

module.exports = {
  uploadLGDCsvController,
  getAllLGDStates,
  getDistrictsByStateLGD,
  getSubDistrictsByDistrictLGD,
  getVillagesBySubDistrictLGD,
};