import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
      console.log(`MongoDB Connected ✅: ${conn.connection.host}`);
      return; // success — exit the function
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed ❌:`,
        error.message
      );

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error(
          "All MongoDB connection attempts failed. The server will continue running without a database connection."
        );
        console.error(
          "⚠️  Please ensure your IP is whitelisted in MongoDB Atlas → Network Access."
        );
      }
    }
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn("⚠️ Continuing server startup anyway (DB features will fail).");
    // process.exit(1); // 👈 Do not exit, keep the server alive for debugging
  }
};

export default connectDB;