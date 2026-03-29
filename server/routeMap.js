import authRouter from "./routes/auth.router.js";
import chatBotRouter from "./routes/chatbot.router.js";
import twinRouter from "./routes/twin.routes.js";
import scanRouter from "./routes/scanrouter.js";

export default (app) => {
  // Maps to: /api/auth/...
  app.use("/auth", authRouter);
  app.use("/chatbot", chatBotRouter);
  app.use("/ask", chatBotRouter); // New general chatbot route
  app.use("/twin", twinRouter);
  app.use("/ocr", scanRouter);
};