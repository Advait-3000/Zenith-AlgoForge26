import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//imported files
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();

//db
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Sample API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working ✅" });
});

// POST example
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("Received:", data);

  res.json({
    success: true,
    received: data,
  });
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});