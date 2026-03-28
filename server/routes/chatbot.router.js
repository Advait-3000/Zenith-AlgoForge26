const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const { askChatbot } = require("../controllers/chatbot.controller");

router.post("/", verifyToken, askChatbot);

module.exports = router;