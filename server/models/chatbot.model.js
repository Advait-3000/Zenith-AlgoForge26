import mongoose from 'mongoose';

const chatbotTriageLogSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true
    },
    reported_symptoms: {
      type: String,
      // Change to optional to support generic AI logs
    },
    ai_severity_rating: {
      type: String,
      enum: ['Normal', 'Moderate', 'Extreme', 'N/A'],
      default: 'N/A'
    },
    // New Orchestrator Fields
    question: { type: String },
    response: { type: String },
    intent: { 
      type: String, 
      enum: ['chatbot', 'digital_twin'],
      default: 'chatbot'
    },
    ai_action_taken: { type: String },
    interaction_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'chatbot_triage_logs',
  }
);

export default mongoose.model('Chatbot_Triage_Logs', chatbotTriageLogSchema);