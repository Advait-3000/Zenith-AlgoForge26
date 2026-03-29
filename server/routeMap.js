import authRouter from "./routes/auth.router.js";
import chatBotRouter from "./routes/chatbot.router.js";
import twinRouter from "./routes/twin.routes.js";
import scanRouter from "./routes/scanrouter.js";
import appointmentRouter from "./routes/appointment.router.js";
import emergencyRouter from "./routes/emergency.router.js";
import unifiedRouter from "./routes/unified.routes.js";

export default (app) => {
  // Maps to: /api/auth/...
  app.use("/auth", authRouter);
  

  // protected routes
  // app.use("/chatbot", chatBotRouter); // DEPRECATED: Use /ask
  // app.use("/twin", twinRouter);       // DEPRECATED: Use /ask
  app.use("/ask", unifiedRouter);
  // Maps to: /api/ocr/...
  app.use("/ocr", scanRouter);
  
  // Maps to: /api/appointments/...
  app.use("/api/appointments", appointmentRouter);
  // Maps to: /api/emergency/...
  app.use("/api/emergency", emergencyRouter);
};