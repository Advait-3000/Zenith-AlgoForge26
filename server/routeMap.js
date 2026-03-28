import authRouter from "./routes/auth.router.js";

export default (app) => {
  app.use("/auth", authRouter);

  // protected routes
//   app.use("/api/chatbot", chatbotRouter);
};