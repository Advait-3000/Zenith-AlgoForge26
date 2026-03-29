import express from "express";
import { askUnified } from "../controllers/unified.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * UNIFIED AI ENTRY POINT
 * Routes between Chatbot and Digital Twin
 */
router.post("/", protect, askUnified);

export default router;
