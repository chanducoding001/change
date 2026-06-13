require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const workInfoRoutes = require("./routes/workRoutes");
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const verifyToken = require("./middlewares/verifyToken");

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Public Routes
app.use(process.env.AUTH_MAIN_URL, authRoutes);
// app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

// Protected Routes
app.use(process.env.DASHBOARD_MAIN_URL, verifyToken,dashboardRoutes);
app.use(process.env.WORK_MAIN_URL, verifyToken, workInfoRoutes);
app.use(process.env.INFORMATION_MAIN_URL, verifyToken, workInfoRoutes);
app.use(process.env.PROFILE_MAIN_URL, verifyToken,profileRoutes);
app.use(process.env.ALL_USERS_MAIN_URL, verifyToken,profileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
