// controllers/chatbotController.js

const PatientReport = require("../models/PatientReport");
const ChatbotLog = require("../models/Chatbot_Triage_Logs");
const { generatePatientFriendlyResponse } = require("../services/geminiService");

exports.askChatbot = async (req, res) => {
  try {
    const { patientId, question } = req.body;

    if (!patientId || !question) {
      return res.status(400).json({
        success: false,
        message: "Missing patientId or question",
      });
    }

    // Get latest report
    const report = await PatientReport.findOne({ patient_id: patientId })
      .sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found",
      });
    }

    // Build context
    const context = `
Summary: ${report.ai_summary}

Risk Level: ${report.risk_level}

Abnormalities:
${report.abnormalities
  .map(a => `${a.name} (${a.severity}): ${a.description}`)
  .join("\n")}
`;

    // AI response
    const answer = await generatePatientFriendlyResponse(context, question);

    // OPTIONAL: Save triage log
    await ChatbotLog.create({
      patient_id: patientId,
      reported_symptoms: question,
      ai_severity_rating: "Normal", // can upgrade later with AI classification
      ai_action_taken: answer,
    });

    res.json({
      success: true,
      answer,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};