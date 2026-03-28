import PatientReport from "../models/reports.model.js";
import ChatbotLog from "../models/chatbot.model.js";
import { generatePatientFriendlyResponse } from "../services/gemini.service.js";

export const askChatbot = async (req, res) => {
  try {
    // SECURE: Extract from req.user (populated by verifyToken middleware)
    const patientId = req.user.id; 
    const  question  = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Get latest report for this specific user
    const report = await PatientReport.findOne({ patient_id: patientId })
      .sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No medical reports found for your account.",
      });
    }

    const context = `Summary: ${report.ai_summary}\nRisk Level: ${report.risk_level}`;
    const answer = await generatePatientFriendlyResponse(context, question);

    await ChatbotLog.create({
      patient_id: patientId,
      reported_symptoms: question,
      ai_severity_rating: "Normal",
      ai_action_taken: answer,
    });

    res.json({ success: true, answer });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
