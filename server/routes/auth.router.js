import express from "express";
const router = express.Router();

import {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  getMe
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

// 🔓 Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔐 Protected routes
router.put("/updateProfile", protect, updateProfile);
router.get("/me", protect, getMe);

export default router;