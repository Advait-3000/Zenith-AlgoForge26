import PatientReport from "../models/reports.model.js";
import ChatbotLog from "../models/chatbot.model.js";
import { generatePatientFriendlyResponse } from "../services/chatbot.service.js";

// 🔥 Helper: map severity
const mapSeverity = (risk) => {
  if (!risk) return "Normal";

  const value = risk.toLowerCase();

  if (value.includes("low")) return "Normal";
  if (value.includes("medium")) return "Moderate";
  if (value.includes("high")) return "Extreme";

  return "Normal";
};

// 🔥 Simple medical keyword filter
const isMedicalQuestion = (question) => {
  const medicalKeywords = [
    "pain", "fever", "headache", "medicine", "tablet", "doctor",
    "hospital", "symptom", "disease", "infection", "injury",
    "blood", "pressure", "sugar", "diabetes", "heart",
    "cough", "cold", "vomit", "nausea", "treatment"
  ];

  const q = question.toLowerCase();

  return medicalKeywords.some((word) => q.includes(word));
};

export const askChatbot = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { question, message } = req.body;
    const prompt = (question || message || "").trim();

    // ✅ Validate input
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "A question or message is required",
      });
    }

    // 🔥 Bypass medical restricted keywords ONLY for the /ask/ route
    const isGeneralRoute = req.baseUrl === "/ask" || req.originalUrl.includes("/ask");
    
    // ❌ Restrict non-medical questions if on the medical /chatbot/ route
    if (!isGeneralRoute && !isMedicalQuestion(prompt)) {
      return res.status(200).json({
        success: false,
        answer: "Please ask medical-related questions only.",
      });
    }

    // ✅ Get latest report
    const report = await PatientReport.findOne({
      patient_id: patientId,
    }).sort({ createdAt: -1 });

    // ✅ Build context
    let context;

    if (report && !isGeneralRoute) {
      const { ai_analysis } = report;
      context = `
Patient Medical Summary:
${ai_analysis?.concise_summary || "No specific summary available."}

Latest Health Score: ${ai_analysis?.calculated_health_score || "N/A"}/100
Findings: ${(ai_analysis?.detected_abnormalities || []).join(", ") || "None highlighted."}
      `;
    } else {
      context = isGeneralRoute 
        ? "You are a general-purpose AI assistant. Answer the user's question clearly."
        : "No prior medical reports are available. Answer in a general, safe, and patient-friendly way. Do NOT assume medical history.";
    }

    // ✅ Generate AI response
    let answer;

    try {
      answer = await generatePatientFriendlyResponse(context, prompt);
    } catch (err) {
      console.error("AI ERROR:", err.message);

      answer =
        "I'm currently unable to process your request. Please try again later.";
    }

    // ✅ Only log medical conversations to the chatbot log
    if (!isGeneralRoute) {
      try {
        // Map severity based on health score (100-75: Normal, 75-40: Moderate, <40: Extreme)
        const score = report?.ai_analysis?.calculated_health_score;
        let severity = "Normal";
        if (score !== undefined) {
          if (score < 40) severity = "Extreme";
          else if (score < 75) severity = "Moderate";
        }

        await ChatbotLog.create({
          patient_id: patientId,
          reported_symptoms: prompt,
          ai_severity_rating: severity,
          ai_action_taken: answer,
        });
      } catch (logErr) {
        console.error("LOG ERROR:", logErr);
      }
    }

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