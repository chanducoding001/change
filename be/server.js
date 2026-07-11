require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const workInfoRoutes = require("./routes/workRoutes");
const personalWorkRoutes = require("./routes/personalWorkRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const censusRoutes = require("./routes/censusRoutes");
const stateLGDRoutes = require("./routes/stateLGDRoutes");
const tourRoutes = require('./routes/tourRoutes/tourRoutes');
const verifyToken = require("./middlewares/verifyToken");
const isAdmin = require("./middlewares/isAdmin");

const app = express();
const PORT = process.env.PORT || 8080;

// Database Connection
connectDB();

// Trust proxy (important for Render, Railway, Nginx, etc.)
app.set("trust proxy", 1);

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL?.split(",") || []),
];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    environment: process.env.NODE_ENV || "development",
    message: "Server is running successfully",
  });
});

// Public Routes
app.use(process.env.AUTH_MAIN_URL || "/api/auth", authRoutes);

// Protected Routes
app.use(
  process.env.DASHBOARD_MAIN_URL || "/api/dashboard",
  verifyToken,
  dashboardRoutes
);

app.use(
  process.env.WORK_MAIN_URL || "/api/work",
  verifyToken,
  workInfoRoutes
);

app.use(
  process.env.INFORMATION_MAIN_URL || "/api/information",
  verifyToken,
  workInfoRoutes
);
app.use(
  process.env.PERSONAL_WORK_MAIN_URL || "/api/personalWork",
  verifyToken,
  isAdmin,
  personalWorkRoutes
);

app.use(
  process.env.PROFILE_MAIN_URL || "/api/profile",
  verifyToken,
  profileRoutes
);
app.use(
  process.env.CENSUS_MAIN_URL || "/api/census",
  verifyToken,
  censusRoutes
);
app.use(
  process.env.STATELGD_MAIN_URL || "/api/stateLGD",
  verifyToken,
  stateLGDRoutes
);
app.use(process.env.TOUR_MAIN_URL,verifyToken,tourRoutes);

app.use(
  process.env.ALL_USERS_MAIN_URL || "/api/users",
  verifyToken,
  profileRoutes
);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} [${
      process.env.NODE_ENV || "development"
    }]`
  );
});





// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const workInfoRoutes = require("./routes/workRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

// const verifyToken = require("./middlewares/verifyToken");

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Database Connection
// connectDB();

// // Trust proxy (important behind Render, Nginx, Railway, etc.)
// app.set("trust proxy", 1);

// // CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL?.split(",") || "*",
//     credentials: true,
//   })
// );

// // Body Parsers
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Health Check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     environment: process.env.NODE_ENV,
//     message: "Server is running successfully",
//   });
// });

// // Public Routes
// app.use(process.env.AUTH_MAIN_URL || "/api/auth", authRoutes);

// // Protected Routes
// app.use(
//   process.env.DASHBOARD_MAIN_URL || "/api/dashboard",
//   verifyToken,
//   dashboardRoutes
// );

// app.use(
//   process.env.WORK_MAIN_URL || "/api/work",
//   verifyToken,
//   workInfoRoutes
// );

// app.use(
//   process.env.INFORMATION_MAIN_URL || "/api/information",
//   verifyToken,
//   workInfoRoutes
// );

// app.use(
//   process.env.PROFILE_MAIN_URL || "/api/profile",
//   verifyToken,
//   profileRoutes
// );

// app.use(
//   process.env.ALL_USERS_MAIN_URL || "/api/users",
//   verifyToken,
//   profileRoutes
// );

// // 404
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err);

//   res.status(err.status || 500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Something went wrong"
//         : err.message,
//   });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(
//     `Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`
//   );
// });



// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const workInfoRoutes = require("./routes/workRoutes");
// const profileRoutes = require('./routes/profileRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const verifyToken = require("./middlewares/verifyToken");

// const app = express();
// const port = process.env.PORT || 8080;

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database Connection
// connectDB();

// // Public Routes
// app.use(process.env.AUTH_MAIN_URL, authRoutes);
// // app.use("/api/auth", authRoutes);

// // Health Check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is running successfully",
//   });
// });

// // Protected Routes
// app.use(process.env.DASHBOARD_MAIN_URL, verifyToken,dashboardRoutes);
// app.use(process.env.WORK_MAIN_URL, verifyToken, workInfoRoutes);
// app.use(process.env.INFORMATION_MAIN_URL, verifyToken, workInfoRoutes);
// app.use(process.env.PROFILE_MAIN_URL, verifyToken,profileRoutes);
// app.use(process.env.ALL_USERS_MAIN_URL, verifyToken,profileRoutes);

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err);

//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// // 404 Route
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
