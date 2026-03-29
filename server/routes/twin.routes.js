import express from "express";
import { addHealthLog, predictImpact } from "../controllers/twin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/log", protect, addHealthLog);
router.post("/predict", protect, predictImpact);

export default router;
