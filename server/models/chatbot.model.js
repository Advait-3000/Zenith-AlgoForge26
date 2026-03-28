import mongoose from 'mongoose';

const chatbotTriageLogSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    reported_symptoms: {
      type: String,
      required: [true, 'Reported symptoms are required'],
    },
    ai_severity_rating: {
      type: String,
      enum: ['Normal', 'Moderate', 'Extreme'],
      required: [true, 'AI severity rating is required'],
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