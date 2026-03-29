import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn("⚠️ Continuing server startup anyway (DB features will fail).");
    // process.exit(1); // 👈 Do not exit, keep the server alive for debugging
  }
};

export default connectDB;