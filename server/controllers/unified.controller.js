import { classifyIntent, classifyIntentAI } from "../services/intentClassifier.js";
import { generatePatientFriendlyResponse } from "../services/chatbot.service.js"; // Existing Chatbot Logic
import { generateHealthPrediction } from "../services/aiPrediction.js"; // Existing Digital Twin Logic
import HealthLog from "../models/healthLog.model.js";
import MedicalRecord from "../models/reports.model.js";
import ChatbotLog from "../models/chatbot.model.js";
import { groq } from "../services/chatbot.service.js"; // Reuse Groq instance

/**
 * AI Orchestrator Layer: Unified Controller
 */
export const askUnified = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Input message is required." });
    }

    // 1. Identify Intent (Keyword Match)
    let intent = classifyIntent(message);

    // 2. AI Fallback for Unknown (Robuts Filtering)
    if (intent === "unknown") {
      intent = await classifyIntentAI(message);
    }

    // 3. Routing Layer
    let botResponse = "";

    if (intent === "unknown") {
      // 🚫 STOP: Do not call any AI services for irrelevant input
      const msg = "Please ask a health-related question or prediction.";
      
      await ChatbotLog.create({
        patient_id: userId,
        question: message,
        response: msg,
        intent: "unknown",
        reported_symptoms: "Irrelevant/Unknown Input",
        ai_severity_rating: "N/A"
      });

      return res.json({
        success: false,
        intent: "unknown",
        message: msg
      });
    }

    if (intent === "digital_twin") {
      // 🏥 DIGITAL TWIN PATHWAY
      const extractedAction = await extractSimulationParameters(message);
      const logs = await HealthLog.find({ userId }).sort({ date: -1 }).limit(7);
      const report = await MedicalRecord.findOne({ patient_id: userId }).sort({ upload_date: -1 });

      botResponse = await generateHealthPrediction({ logs, report, action: extractedAction });
    } else {
      // 💬 CHATBOT PATHWAY (Medical QA)
      const contextLogs = await ChatbotLog.find({ patient_id: userId }).limit(3);
      const context = contextLogs.map(l => l.reported_symptoms).join(' | ');

      botResponse = await generatePatientFriendlyResponse(context, message);
    }

    // 📓 LOGGING: Unified entry in existing ChatbotLog collection
    await ChatbotLog.create({
      patient_id: userId,
      question: message,
      response: botResponse,
      intent,
      reported_symptoms: intent === "chatbot" ? "General Conversation" : "Simulation Attempt",
      ai_severity_rating: "N/A"
    });

    res.json({
      success: true,
      intent,
      data: botResponse,
    });

  } catch (error) {
    console.error("Unified Orchestrator Error:", error.message);
    res.status(500).json({ success: false, message: "Server error in orchestrator layer." });
  }
};

/**
 * HELPER: Extracts "action parameters" from a natural what-if string
 * Returns an object e.g. { sleepHours: 4, calories: 3000 }
 */
const extractSimulationParameters = async (message) => {
  try {
    const extractionPrompt = `
Extract numerical health parameters from this question into JSON format.
FIELDS: sleepHours, calories, steps.

Input: "${message}"
Response ONLY in JSON. Example: {"sleepHours": 8, "calories": 2000}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: extractionPrompt }],
      temperature: 0.1, // High precision
    });

    const extracted = JSON.parse(chatCompletion.choices[0].message.content);
    return extracted;
  } catch (e) {
    // Fallback defaults if extraction fails
    return { sleepHours: 6, calories: 2000, steps: 5000 };
  }
};
