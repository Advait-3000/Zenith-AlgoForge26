const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
      index: true,
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
      index: true,
    },

    // ─── SCHEDULING ──────────────────────────────────────
    appointment_date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },

    appointment_end_time: {
      type: Date, // optional but useful
    },

    // ─── STATUS ──────────────────────────────────────────
    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "Completed",
        "Cancelled",
        "No_Show",
        "Rescheduled",
      ],
      default: "Scheduled",
    },

    // ─── TYPE (ONLINE / OFFLINE) ─────────────────────────
    consultation_type: {
      type: String,
      enum: ["In-Person", "Video"],
      default: "In-Person",
    },

    clinic_location: {
      type: String, // for in-person
    },

    meeting_link: {
      type: String, // for video consultation
    },

    // ─── NOTES ───────────────────────────────────────────
    meeting_notes: {
      type: String,
      trim: true,
    },

    // ─── META ────────────────────────────────────────────
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "appointments",
  }
);

// ─── INDEXES ─────────────────────────────────────────────

// Doctor dashboard (appointments sorted by date)
appointmentSchema.index({ doctor_id: 1, appointment_date: 1 });

// Patient history
appointmentSchema.index({ patient_id: 1, appointment_date: 1 });

// Filter by status (e.g., upcoming, completed)
appointmentSchema.index({ status: 1 });

// Upcoming appointments optimization
appointmentSchema.index({ appointment_date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);