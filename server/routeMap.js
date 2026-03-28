import authRouter from "./routes/auth.router.js";
import chatBotRouter from "./routes/chatbot.router.js";
import scanRouter from "./routes/scanrouter.js";

export default (app) => {
  // Maps to: /api/auth/...
  app.use("/auth", authRouter);

  // protected routes
  app.use("/chatbot", chatBotRouter);
  // Maps to: /api/ocr/...
  app.use("/ocr", scanRouter);
};