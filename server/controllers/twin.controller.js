import HealthLog from "../models/healthLog.model.js";
import MedicalRecord from "../models/reports.model.js";
import { getRuleBasedPredictions } from "../services/predictionEngine.js";
import { generateHealthPrediction } from "../services/aiPrediction.js";

// POST /api/twin/log
export const addHealthLog = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    await HealthLog.create({ ...req.body, userId });
    
    res.status(201).json({ message: "Health log saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/twin/predict
export const predictImpact = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action object is required." });
    }

    const logs = await HealthLog.find({ userId }).sort({ date: -1 }).limit(7);
    const report = await MedicalRecord.findOne({ patient_id: userId }).sort({ upload_date: -1 });

    const ruleBased = getRuleBasedPredictions({ logs, report }, action);
    const aiPrediction = await generateHealthPrediction({ logs, report, action });

    res.json({
      ruleBased,
      aiPrediction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
