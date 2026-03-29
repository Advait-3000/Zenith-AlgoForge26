import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

// imported files
import connectDB from "./config/db.js";
import routeMap from "./routeMap.js";

const app = express();

// db
await connectDB();

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});