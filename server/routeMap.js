import authRouter from "./routes/auth.router.js";
import chatBotRouter from "./routes/chatbot.router.js";

export default (app) => {
  app.use("/auth", authRouter);

  // protected routes
  app.use("/chatbot", chatBotRouter);
};