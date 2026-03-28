import PatientReport from "../models/reports.model.js";
import ChatbotLog from "../models/chatbot.model.js";
import { generatePatientFriendlyResponse } from "../services/chatbot.service.js";

// 🔥 Helper: map risk_level → schema enum
const mapSeverity = (risk) => {
  if (!risk) return "Normal";

  const value = risk.toLowerCase();

  if (value.includes("low")) return "Normal";
  if (value.includes("medium")) return "Moderate";
  if (value.includes("high")) return "Extreme";

  return "Normal"; // fallback
};

export const askChatbot = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { question } = req.body;

    // ✅ Validate input
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // ✅ Get latest report
    const report = await PatientReport.findOne({
      patient_id: patientId,
    }).sort({ createdAt: -1 });

    // ✅ Build context
    let context;

    if (report) {
      context = `
Patient Medical Summary:
${report.ai_summary}

Risk Level: ${report.risk_level}
      `;
    } else {
      context = `
No prior medical reports are available.

Answer in a general, safe, and patient-friendly way.
Do NOT assume medical history.
      `;
    }

    // ✅ Generate AI response (with fallback)
    let answer;

    try {
      answer = await generatePatientFriendlyResponse(context, question);
    } catch (err) {
      console.error("AI ERROR:", err.message);

      answer =
        "I'm currently unable to process your request. Please try again in a moment.";
    }

    // ✅ Map severity safely (ALWAYS valid enum)
    const severity = mapSeverity(report?.risk_level);

    // ✅ Save log
    await ChatbotLog.create({
      patient_id: patientId,
      reported_symptoms: question,
      ai_severity_rating: severity,
      ai_action_taken: answer,
    });

    // ✅ Response
    return res.status(200).json({
      success: true,
      answer,
      hasReport: !!report,
    });
  } catch (err) {
    console.error("CHATBOT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};