import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected...");
    
    const lat = 23.0225;
    const lng = 72.5714;
    
    // Find nearest doc
    const nearest = await User.findOne({
      role: "Doctor",
      location_coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 20000, // 20km
        },
      },
    });

    if (nearest) {
      console.log(`✅ Found: ${nearest.full_name} at distance...`);
      console.log(JSON.stringify(nearest.doctor_details, null, 2));
    } else {
      console.log("❌ NO DOCTORS FOUND within 20km.");
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
checkDoctors();
