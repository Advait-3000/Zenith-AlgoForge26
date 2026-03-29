import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sleepHours: { type: Number },
    calories: { type: Number },
    steps: { type: Number },
    mood: { type: String },
    weight: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("HealthLog", healthLogSchema);
