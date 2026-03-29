import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("🌱 Connected to MongoDB for seeding...");

        // Clear existing test doctors to avoid duplicates
        await User.deleteMany({ email: { $regex: /test_doctor/ } });

        const doctors = [
            {
                email: "test_hospital_far@example.com",
                password_hash: "dummy",
                role: "Doctor",
                full_name: "City General Hospital (Level 1)",
                location_coordinates: { type: "Point", coordinates: [72.6500, 23.1500] }, // ~14km away (Only reachable by Level 1 search)
                doctor_details: { 
                  specialization: "Emergency Medicine", 
                  workplace_name: "City General ER",
                  workplace_type: "Hospital"
                }
            },
            {
                email: "test_clinic_near@example.com",
                password_hash: "dummy",
                role: "Doctor",
                full_name: "Dr. Sanjeev Shah (Clinic)",
                location_coordinates: { type: "Point", coordinates: [72.5750, 23.0250] }, // ~0.5km away
                doctor_details: { 
                  specialization: "Cardiologist", 
                  workplace_name: "Shah Cardiac Center",
                  workplace_type: "Self-Clinic"
                }
            },
            {
                email: "test_hospital_near@example.com",
                password_hash: "dummy",
                role: "Doctor",
                full_name: "Zenith Multi-Specialty Hospital",
                location_coordinates: { type: "Point", coordinates: [72.5850, 23.0300] }, // ~1.5km away
                doctor_details: { 
                  specialization: "General Physician", 
                  workplace_name: "Zenith ER",
                  workplace_type: "Hospital"
                }
            }
        ];

        await User.insertMany(doctors);
        console.log("✅ Successfully seeded 3 test doctors with coordinates!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seed();
