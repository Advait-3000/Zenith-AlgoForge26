import express from "express"
const router = express.Router();

import { register, login , updateProfile} from "../controllers/auth.controller.js";
import {protect} from "../middlewares/auth.middleware.js"

// Public routes
router.post("/register", register);
router.post("/login", login);
router.put("/updateProfile", protect , updateProfile)

export default router