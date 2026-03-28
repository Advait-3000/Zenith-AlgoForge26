const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ─── AUTH ─────────────────────────────────────────────
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      required: [true, "Role is required"],
    },

    // ─── BASIC INFO ───────────────────────────────────────
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    contact_number: { type: String, trim: true },

    // 🌍 GEO LOCATION (UPDATED)
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

    // ─── DOCTOR FIELDS ────────────────────────────────────
    doctor_details: {
      specialization: String,
      workplace_type: {
        type: String,
        enum: ["Hospital", "Self-Clinic"],
      },
      workplace_name: String,
      verification: {
        registration_number: String,
        certificate_s3_url: String,
        is_verified: { type: Boolean, default: false },
      },
    },

    // ─── PATIENT FIELDS ───────────────────────────────────
    patient_details: {
      date_of_birth: Date,
      gender: String,

      vitals: {
        height_cm: Number,
        weight_kg: Number,
        bmi: Number,
        blood_group: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        allergies: [{ type: String }],
      },

      disease_history: [
        {
          disease_name: String,
          status: {
            type: String,
            enum: ["Present", "Past"],
          },
          diagnosis_date: Date,
          resolved_date: Date,
        },
      ],

      current_health_score: Number,

      health_score_history: [
        {
          score: Number,
          date_calculated: Date,
        },
      ],

      emergency_contacts: [
        {
          name: String,
          relation: String,
          phone: String,
        },
      ],
    },

    // ─── SYSTEM META ───────────────────────────────────────
    is_active: { type: Boolean, default: true },
    last_login: Date,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// ─── INDEXES ─────────────────────────────────────────────

// ✅ Geo index (for nearby search)
userSchema.index({ location_coordinates: "2dsphere" });

// ✅ Role index (fast filtering)
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);