import express from "express";
import { findNearestClinics } from "../controllers/emergency.controller.js";
import authMiddleware from "../utilities/verifyToken.js";

const router = express.Router();

/**
 * @route   POST /api/emergency/search
 * @desc    Real-time tracking & nearest clinic redirection
 * @access  Private (Patient/Staff)
 */
router.post("/search", authMiddleware, findNearestClinics);

export default router;
