import express from "express";
const router = express.Router();

import { protect } from "../middlewares/auth.middleware.js";
import { askChatbot } from "../controllers/chatbot.controller.js";

router.post("/", protect , askChatbot);

export default router;