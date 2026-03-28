import mongoose from "mongoose";

const agenticFollowUpSchema = new mongoose.Schema(
  {
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
      index: true,
    },

    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
      index: true,
    },

    original_prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord", // ✅ updated to match your new model name
      required: [true, "Original prescription ID is required"],
    },

    // ─── AI SUGGESTION ───────────────────────────────────
    ai_suggested_date: {
      type: Date,
      required: [true, "AI suggested date is required"],
    },

    // ─── PATIENT INTERACTION ─────────────────────────────
    patient_notification_status: {
      type: String,
      enum: ["Pending", "Sent", "Read"],
      default: "Pending",
    },

    reminder_status: {
      type: String,
      enum: ["Pending", "Accepted", "Edited", "Rejected"],
      default: "Pending",
    },

    final_agreed_date: {
      type: Date,
    },

    // ─── META ────────────────────────────────────────────
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "agentic_ai_followups",
  }
);

// ─── INDEXES ─────────────────────────────────────────────

// Fast lookup: doctor's follow-ups
agenticFollowUpSchema.index({ doctor_id: 1 });

// Fast lookup: patient's follow-ups
agenticFollowUpSchema.index({ patient_id: 1 });

// Sort by upcoming follow-ups
agenticFollowUpSchema.index({ final_agreed_date: 1 });

// Filter pending actions
agenticFollowUpSchema.index({ reminder_status: 1 });

export default mongoose.model(
  "AgenticFollowUp",
  agenticFollowUpSchema
);