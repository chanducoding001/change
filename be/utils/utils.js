// Frontend
//       │
//       ▼
// searchQuery
//       │
//       ▼
// MongoDB Cache
//       │
//       ├── Found → Return
//       │
//       └── Not Found
//               │
//               ▼
//         Nominatim
//               │
//               ▼
//           Places[]
//               │
//               ▼
//       Remove Duplicates
//               │
//               ▼
//      OSRM Distance Matrix
//               │
//               ▼
//     TSP + 2-opt Optimization
//               │
//               ▼
//       OSRM Route Geometry
//               │
//               ▼
//          Save MongoDB
//               │
//               ▼
//           Return Tour
