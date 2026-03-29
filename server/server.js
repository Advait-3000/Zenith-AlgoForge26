import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// imported files
import connectDB from "./config/db.js";
import routeMap from "./routeMap.js";

// Load environment variables
dotenv.config();

const app = express();

// db
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ CALL ROUTEMAP HERE
routeMap(app);

// Test route
app.get("/api", (req, res) => {
  res.send("API is running 🚀");
});
// Port
const PORT = process.env.PORT || 3000;

// Global Error Handler to always return JSON (fixes HTML crash responses)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});