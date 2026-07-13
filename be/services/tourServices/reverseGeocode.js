// const axios = require("axios");

// const reverseGeocode = async ({ latitude, longitude }) => {
//     const { data } = await axios.get(
//         "https://nominatim.openstreetmap.org/reverse",
//         {
//             params: {
//                 lat: latitude,
//                 lon: longitude,
//                 format: "jsonv2",
//                 addressdetails: 1,
//             },
//             headers: {
//                 "User-Agent": "TourApplication/1.0",
//             },
//         }
//     );

//     return {
//         latitude,
//         longitude,
//         name:
//             data.name ||
//             data.address?.village ||
//             data.address?.town ||
//             data.address?.city ||
//             "",
//         displayName: data.display_name,
//         address: {
//             country: data.address?.country,
//             state: data.address?.state,
//             district:
//                 data.address?.state_district ||
//                 data.address?.county,
//             subDistrict:
//                 data.address?.suburb ||
//                 data.address?.municipality,
//             village:
//                 data.address?.village ||
//                 data.address?.hamlet,
//             postcode: data.address?.postcode,
//         },
//     };
// };

// module.exports = {reverseGeocode};
