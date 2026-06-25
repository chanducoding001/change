// controllers/censusController.js
const fs = require("fs");
const StateCensus = require("../models/CensusData");
const { parse } = require("csv-parse");
const BSON = require("bson");


const pickCensusData = (row) => ({
  State: row.State,
  District: row.District,
  Subdistt: row.Subdistt,
  "Town/Village": row["Town/Village"],
  Ward: row.Ward,
  EB: row.EB,
  Level: row.Level,
  Name: row.Name,
  TRU: row.TRU,
  No_HH: row.No_HH,
  TOT_P: row.TOT_P,
  TOT_M: row.TOT_M,
  TOT_F: row.TOT_F,
  P_SC: row.P_SC,
  M_SC: row.M_SC,
  F_SC: row.F_SC,
  P_ST: row.P_ST,
  M_ST: row.M_ST,
  F_ST: row.F_ST,
  P_LIT: row.P_LIT,
  M_LIT: row.M_LIT,
  F_LIT: row.F_LIT,
  P_ILL: row.P_ILL,
  M_ILL: row.M_ILL,
  F_ILL: row.F_ILL,
});

const uploadCsvController = async (
  req,
  res
) => {
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
    let stateCensusData = {};
    let rowCount = 0;

    await new Promise(
      (resolve, reject) => {
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

            const level =
              row.Level?.trim();

            const tru =
              row.TRU?.trim();

            const districtCode =
              row.District?.trim();

            const subDistrictCode =
              row.Subdistt?.trim();

            const villageCode =
              row[
                "Town/Village"
              ]?.trim();

            // STATE
            if (!stateCode) {
              stateCode =
                row.State?.trim();
            }

            if (
              level ===
                "STATE" &&
              tru === "Total"
            ) {
              stateName =
                row.Name;
              stateCensusData =
                pickCensusData(
                  row
                );
            }

            if (!districtCode)
              return;

            // DISTRICT
            if (
              !districtMap.has(
                districtCode
              )
            ) {
              districtMap.set(
                districtCode,
                {
                  districtCode,
                  name: "",
                  level: "",
                  censusData:
                    {},
                  subDistrictMap:
                    new Map(),
                  subDistricts:
                    [],
                }
              );
            }

            const district =
              districtMap.get(
                districtCode
              );

            if (
              level ===
                "DISTRICT" &&
              tru === "Total"
            ) {
              district.name =
                row.Name;
              district.level =
                level;
              district.censusData =
                pickCensusData(
                  row
                );
            }

            if (
              !subDistrictCode
            )
              return;

            // SUB DISTRICT
            if (
              !district.subDistrictMap.has(
                subDistrictCode
              )
            ) {
              district.subDistrictMap.set(
                subDistrictCode,
                {
                  subDistrictCode,
                  name: "",
                  level: "",
                  censusData:
                    {},
                  villageMap:
                    new Map(),
                  villages:
                    [],
                }
              );
            }

            const subDistrict =
              district.subDistrictMap.get(
                subDistrictCode
              );

            if (
              level ===
                "SUB-DISTRICT" &&
              tru === "Total"
            ) {
              subDistrict.name =
                row.Name;
              subDistrict.level =
                level;
              subDistrict.censusData =
                pickCensusData(
                  row
                );
            }

            // VILLAGE / TOWN
            if (
              villageCode &&
              (
                level ===
                  "VILLAGE" ||
                level ===
                  "TOWN"
              )
            ) {
              if (
                !subDistrict.villageMap.has(
                  villageCode
                )
              ) {
                subDistrict.villageMap.set(
                  villageCode,
                  {
                    villageCode,
                    name:
                      row.Name,
                    level,
                    censusData:
                      pickCensusData(
                        row
                      ),
                  }
                );
              }
            }
          })
          .on("end", resolve)
          .on("error", reject);
      }
    );

    if (!stateCode) {
      return res.status(400).json({
        success: false,
        message:
          "No valid data found in CSV",
      });
    }

    const exists =
      await StateCensus.exists({
        stateCode,
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: `State ${stateCode} already exists`,
      });
    }

    const stateData = {
      stateCode,
      stateName,
      censusData:
        stateCensusData,
      districts: [],
    };

    let villageCount = 0;
    let subDistrictCount = 0;

    districtMap.forEach(
      (district) => {
        district.subDistrictMap.forEach(
          (
            subDistrict
          ) => {
            subDistrict.villages =
              Array.from(
                subDistrict.villageMap.values()
              );

            villageCount +=
              subDistrict
                .villages
                .length;

            subDistrictCount++;

            delete subDistrict.villageMap;

            district.subDistricts.push(
              subDistrict
            );
          }
        );

        delete district.subDistrictMap;

        stateData.districts.push(
          district
        );
      }
    );

    const size =
      BSON.calculateObjectSize(
        stateData
      );

    const sizeMB = (
      size /
      1024 /
      1024
    ).toFixed(2);

    console.log(
      `Document Size: ${sizeMB} MB`
    );

    if (size >
        16 * 1024 * 1024) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            `Document size (${sizeMB} MB) exceeds MongoDB's 16 MB limit.`,
        });
    }

    const saved =
      await StateCensus.create(
        stateData
      );

    return res.status(201).json({
      success: true,
      message:
        "State uploaded successfully",
      stateCode:
        saved.stateCode,
      rows: rowCount,
      districts:
        saved.districts.length,
      subDistricts:
        subDistrictCount,
      villages:
        villageCount,
      sizeMB,
    });
  } catch (err) {
    console.error(
      "Upload Error:",
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
        fs.unlinkSync(
          filePath
        );
      } catch (e) {
        console.error(
          "Cleanup Error:",
          e
        );
      }
    }
  }
};

// const uploadCsvController = async (req, res) => {
//   let filePath;

//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "CSV file is required",
//       });
//     }

//     filePath = req.file.path;

//     console.log("START PARSE");

//     let count = 0;

//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .pipe(
//           parse({
//             columns: true,
//             bom: true,
//             trim: true,
//             skip_empty_lines: true,
//           })
//         )
//         .on("data", () => {
//           count++;
//         })
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     console.log("PARSE DONE");
//     console.log("Rows:", count);

//     console.log("BUILDING DISTRICT MAP");

// const districtMap = new Map();

// await new Promise((resolve, reject) => {
//   fs.createReadStream(filePath)
//     .pipe(
//       parse({
//         columns: true,
//         bom: true,
//         trim: true,
//         skip_empty_lines: true,
//       })
//     )
//     .on("data", (row) => {
//       const districtCode = row.District?.trim();

//       if (!districtCode) return;

//       if (!districtMap.has(districtCode)) {
//         districtMap.set(districtCode, {
//           districtCode,
//         });
//       }
//     })
//     .on("end", resolve)
//     .on("error", reject);
// });

// console.log(
//   "DISTRICTS:",
//   districtMap.size
// );

// console.log("BUILDING FULL DATA");

// let stateCode = "";
// let stateName = "";
// let stateCensusData = {};

// districtMap.clear();

// await new Promise((resolve, reject) => {
//   fs.createReadStream(filePath)
//     .pipe(
//       parse({
//         columns: true,
//         bom: true,
//         trim: true,
//         skip_empty_lines: true,
//       })
//     )
//     .on("data", (row) => {
//       try {
//         const level = row.Level?.trim();
//         const tru = row.TRU?.trim();
//         const districtCode = row.District?.trim();
//         const subDistrictCode =
//           row.Subdistt?.trim();
//         const villageCode =
//           row["Town/Village"]?.trim();

//         if (!stateCode) {
//           stateCode =
//             row.State?.trim();
//         }

//         if (
//           level === "STATE" &&
//           tru === "Total"
//         ) {
//           stateName = row.Name;
//           stateCensusData = row;
//         }

//         if (!districtCode) return;

//         if (
//           !districtMap.has(
//             districtCode
//           )
//         ) {
//           districtMap.set(
//             districtCode,
//             {
//               districtCode,
//               name: "",
//               level: "",
//               censusData: {},
//               subDistrictMap:
//                 new Map(),
//               subDistricts: [],
//             }
//           );
//         }

//         const district =
//           districtMap.get(
//             districtCode
//           );

//         if (
//           level === "DISTRICT" &&
//           tru === "Total"
//         ) {
//           district.name =
//             row.Name;
//           district.level =
//             level;
//           district.censusData =
//             row;
//         }

//         if (!subDistrictCode)
//           return;

//         if (
//           !district.subDistrictMap.has(
//             subDistrictCode
//           )
//         ) {
//           district.subDistrictMap.set(
//             subDistrictCode,
//             {
//               subDistrictCode,
//               name: "",
//               level: "",
//               censusData: {},
//               villageMap:
//                 new Map(),
//               villages: [],
//             }
//           );
//         }

//         const subDistrict =
//           district.subDistrictMap.get(
//             subDistrictCode
//           );

//         if (
//           level ===
//             "SUB-DISTRICT" &&
//           tru === "Total"
//         ) {
//           subDistrict.name =
//             row.Name;
//           subDistrict.level =
//             level;
//           subDistrict.censusData =
//             row;
//         }

//         if (
//           villageCode &&
//           (
//             level === "VILLAGE" ||
//             level === "TOWN"
//           )
//         ) {
//           if (
//             !subDistrict.villageMap.has(
//               villageCode
//             )
//           ) {
//             subDistrict.villageMap.set(
//               villageCode,
//               {
//                 villageCode,
//                 name:
//                   row.Name,
//                 level,
//                 censusData:
//                   row,
//               }
//             );
//           }
//         }
//       } catch (e) {
//         reject(e);
//       }
//     })
//     .on("end", resolve)
//     .on("error", reject);
// });

// console.log("FULL DATA BUILT");
//   } catch (err) {
//     console.error("ERROR:", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//       stack: err.stack,
//     });
//   } finally {
//     if (filePath && fs.existsSync(filePath)) {
//       try {
//         fs.unlinkSync(filePath);
//       } catch (e) {
//         console.error(
//           "Cleanup error:",
//           e
//         );
//       }
//     }
//   }
// };

// const uploadCsvController = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "CSV file is required",
//       });
//     }

//     const rows = [];

//     Readable.from(req.file.buffer.toString())
//       .pipe(csv())
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         try {
//           if (!rows.length) {
//             return res.status(400).json({
//               success: false,
//               message: "CSV is empty",
//             });
//           }

//           const stateCode = rows[0]["State"];

//           const exists = await StateCensus.exists({
//             stateCode,
//           });

//           if (exists) {
//             return res.status(400).json({
//               success: false,
//               message: `State ${stateCode} already uploaded`,
//             });
//           }

//           const stateName =
//             rows.find((r) => r.Level === "STATE" && r.TRU === "Total")?.Name ||
//             "";

//           const stateData = {
//             stateCode,
//             stateName,
//             censusData: {},
//             districts: [],
//           };

//           const districtMap = new Map();

//           rows.forEach((row) => {
//             const districtCode = row.District;
//             const subDistrictCode = row.Subdistt;
//             const villageCode = row["Town/Village"];

//             if (row.Level === "STATE" && row.TRU === "Total") {
//               stateData.censusData = row;
//             }

//             if (!districtCode) return;

//             if (!districtMap.has(districtCode)) {
//               districtMap.set(districtCode, {
//                 districtCode,
//                 name: "",
//                 level: "",
//                 censusData: {},
//                 subDistricts: [],
//                 subDistrictMap: new Map(),
//               });
//             }

//             const district = districtMap.get(districtCode);

//             if (row.Level === "DISTRICT" && row.TRU === "Total") {
//               district.name = row.Name;
//               district.level = row.Level;
//               district.censusData = row;
//             }

//             if (!subDistrictCode) return;

//             if (!district.subDistrictMap.has(subDistrictCode)) {
//               district.subDistrictMap.set(subDistrictCode, {
//                 subDistrictCode,
//                 name: "",
//                 level: "",
//                 censusData: {},
//                 villages: [],
//                 villageMap: new Map(),
//               });
//             }

//             const subDistrict = district.subDistrictMap.get(subDistrictCode);

//             if (row.Level === "SUB-DISTRICT" && row.TRU === "Total") {
//               subDistrict.name = row.Name;
//               subDistrict.level = row.Level;
//               subDistrict.censusData = row;
//             }

//             if (
//               villageCode &&
//               row.TRU === "Total" &&
//               (row.Level === "VILLAGE" || row.Level === "TOWN")
//             ) {
//               if (!subDistrict.villageMap.has(villageCode)) {
//                 subDistrict.villageMap.set(villageCode, {
//                   villageCode,
//                   name: row.Name,
//                   level: row.Level,
//                   censusData: row,
//                 });
//               }
//             }
//           });

//           districtMap.forEach((district) => {
//             district.subDistrictMap.forEach((subDistrict) => {
//               subDistrict.villages = Array.from(
//                 subDistrict.villageMap.values(),
//               );

//               delete subDistrict.villageMap;

//               district.subDistricts.push(subDistrict);
//             });

//             delete district.subDistrictMap;

//             stateData.districts.push(district);
//           });

//           const saved = await StateCensus.create(stateData);

//           return res.status(201).json({
//             success: true,
//             message: "State uploaded successfully",
//             stateCode: saved.stateCode,
//             districts: saved.districts.length,
//           });
//         } catch (err) {
//           return res.status(500).json({
//             success: false,
//             message: err.message,
//           });
//         }
//       });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const getAllStates = async (req, res) => {
  try {
    const states = await StateCensus.find()
      // .select(
      //   "stateName stateCode censusData"
      // )
      .select("stateName stateCode")
      .sort({
        stateName: 1,
      })
      .lean();

    const data = states.map((state) => ({
      label: state.stateName,
      value: state.stateName,
      stateCode: state.stateCode,
      id: state._id,
      // censusData:
      //   state.censusData,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDistrictsByState = async (req, res) => {
  try {
    const { stateCode } = req.params;

    const state = await StateCensus.findOne({ stateCode })
      .select("districts")
      .lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const data = state.districts.map((district) => ({
      label: district.name,
      value: district.name,
      districtCode: district.districtCode,
      id: district.districtCode,
      // censusData:
      //   district.censusData,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSubDistrictsByDistrict = async (req, res) => {
  try {
    const { stateCode, districtCode } = req.params;

    const state = await StateCensus.findOne({ stateCode })
      .select("districts")
      .lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const district = state.districts.find(
      (d) => d.districtCode === districtCode,
    );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    const data = district.subDistricts.map((subDistrict) => ({
      label: subDistrict.name,
      value: subDistrict.name,
      subDistrictCode: subDistrict.subDistrictCode,
      id: subDistrict.subDistrictCode,
      // censusData:
      //   subDistrict.censusData,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVillagesBySubDistrict = async (
  req,
  res
) => {
  try {
    const {
      stateCode,
      districtCode,
      subDistrictCode,
    } = req.params;

    const state =
      await StateCensus.findOne({
        stateCode: stateCode.toString(),
      }).lean();

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const district =
      state.districts?.find(
        (d) =>
          d.districtCode?.toString() ===
          districtCode.toString()
      );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    const subDistrict =
      district.subDistricts?.find(
        (sd) =>
          sd.subDistrictCode?.toString() ===
          subDistrictCode.toString()
      );

    if (!subDistrict) {
      return res.status(404).json({
        success: false,
        message:
          "SubDistrict not found",
      });
    }

    // const villages =
    //   (subDistrict.villages || []).map(
    //     (village) => ({
    //       label: village.name,
    //       value: village.name,
    //       id: village.villageCode,
    //       villageCode:
    //         village.villageCode,
    //       censusData:
    //         village.censusData || {},
    //     })
    //   );
    const onlyVillages = (subDistrict.villages || []).map((village)=>village.censusData || {});
    const villages = [state.censusData,district.censusData,subDistrict.censusData,...onlyVillages];

    return res.status(200).json({
      success: true,
      count: onlyVillages.length,
      state: {
        stateCode:
          state.stateCode,
        stateName:
          state.stateName,
        censusData:
          state.censusData,
      },
      district: {
        districtCode:
          district.districtCode,
        name: district.name,
        censusData:
          district.censusData,
      },
      subDistrict: {
        subDistrictCode:
          subDistrict.subDistrictCode,
        name: subDistrict.name,
        censusData:
          subDistrict.censusData,
      },
      data: villages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch villages",
      error: error.message,
    });
  }
};



module.exports = {
  uploadCsvController,
  getAllStates,
  getDistrictsByState,
  getSubDistrictsByDistrict,
  getVillagesBySubDistrict,
};

