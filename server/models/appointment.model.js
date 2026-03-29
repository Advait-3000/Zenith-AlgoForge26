import mongoose from "mongoose";

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
      // Made optional for cases where user books a facility or clinic not in system
    },

    facility_name: {
      type: String,
      trim: true,
    },

    specialty: {
      type: String,
      trim: true,
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
      default: "Confirmed",
    },

    // 🌍 GEO LOCATION (For Map directions)
    location_coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // 🧠 AI CONCIERGE INSIGHTS ──────────────────────────────
    ai_concierge: {
      reminders: [String],
      importance_note: String,
      digital_consent_required: { type: Boolean, default: false },
    },

    // ─── TYPE (ONLINE / OFFLINE) ─────────────────────────
    consultation_type: {
      type: String,
      enum: ["In-Person", "Video"],
      default: "In-Person",
    },

    clinic_location: {
      type: String, // for in-person address string
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

export default mongoose.model("Appointment", appointmentSchema);