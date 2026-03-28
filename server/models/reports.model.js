import mongoose from "mongoose";

// ─── AI ANALYSIS SUB-SCHEMA ─────────────────────────────
const aiAnalysisSchema = new mongoose.Schema(
  {
    concise_summary: {
      type: String,
      trim: true,
    },
    detected_abnormalities: {
      type: [String],
      default: [],
    },
    risk_predictions: {
      type: [String],
      default: [],
    },
    patient_translation: {
      type: String,
      trim: true,
    },
    calculated_health_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    score_factors: {
      type: [String],
      default: [],
    },
<<<<<<< HEAD
=======
    // ─── HIERARCHICAL CLINICAL ANALYSIS ─────────────────
    primary_clinical_concerns: [{
      category: String,
      test_name: String,
      result: String,
      unit: String,
      reference_range: String,
      implication: String
    }],
    secondary_findings: [{
      category: String,
      test_name: String,
      result: String,
      unit: String,
      reference_range: String
    }],
    stable_systems: [String],
    
    // ─── EXTRACTED CLINICAL DATA ─────────────────────────
    patient_details: {
      name: String,
      age: String,
      gender: String,
      pid: String
    },
    lab_details: {
      name: String,
      location: String,
      sample_date: Date
    },
    clinical_data: {
      type: Map,
      of: String // Store "Value Unit" (e.g., "12.5 g/dL")
    },
    summary_file_url: {
      type: String // URL to the dedicated summary file on Cloudinary
    }
>>>>>>> origin/features
  },
  { _id: false }
);

// ─── MAIN MEDICAL RECORD SCHEMA ─────────────────────────
const medicalRecordSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
<<<<<<< HEAD
      index: true,
=======
    //   index: true,
>>>>>>> origin/features
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader ID is required"],
    },

    document_type: {
      type: String,
      enum: [
        "Lab Report",
        "Scan",
        "Digital Image",
        "Online Prescription",
      ],
      required: true,
    },

    upload_format: {
      type: String,
      trim: true,
    },

    s3_file_url: {
      type: String,
      required: [true, "S3 file URL is required"],
    },

    // ─── OCR DATA ────────────────────────────────────────
    ocr_extracted_text: {
      type: String,
    },

    // ─── AI INSIGHTS ─────────────────────────────────────
    ai_analysis: {
      type: aiAnalysisSchema,
    },

    // ─── META ────────────────────────────────────────────
    upload_date: {
      type: Date,
      default: Date.now,
    },

    is_deleted: {
      type: Boolean,
      default: false, // soft delete
    },
  },
  {
    timestamps: true,
    collection: "medical_records_and_insights",
  }
);

// ─── INDEXES ─────────────────────────────────────────────

<<<<<<< HEAD
// Fast patient record lookup
medicalRecordSchema.index({ patient_id: 1 });

=======
>>>>>>> origin/features
// Filter by document type
medicalRecordSchema.index({ document_type: 1 });

// Sort recent uploads fast
medicalRecordSchema.index({ upload_date: -1 });

// Optional: search inside OCR text (for future AI/search)
medicalRecordSchema.index({ ocr_extracted_text: "text" });

export default mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);