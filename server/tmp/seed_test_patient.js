import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const seedPatient = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🌱 Connected to MongoDB...");

        const patientId = "69c822fca7202fc1ef5be49b"; // The ID the user is testing with

        // 1. Create/Update the Patient
        const patientData = {
            _id: new mongoose.Types.ObjectId(patientId),
            email: "lyubochka@example.com",
            password_hash: "hashed_dummy",
            role: "Patient",
            full_name: "Lyubochka",
            contact_number: "+918779491870", // User's phone for confirmation
            location_coordinates: { type: "Point", coordinates: [72.5714, 23.0225] },
            patient_details: {
                emergency_contacts: [
                    {
                        name: "Emergency Contact",
                        relation: "Guardian",
                        phone: "+918779491870" // User's phone for SOS alerts
                    }
                ]
            }
        };

        await User.findByIdAndDelete(patientId); // Clear old one
        const patient = await User.create(patientData);

        console.log(`✅ TEST PATIENT SEEDED!`);
        console.log(`ID: ${patient._id}`);
        console.log(`Name: ${patient.full_name}`);
        console.log(`Phone: ${patient.contact_number}`);
        console.log(`\nUse this ID in your Postman/Request: ${patientId}`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        if (err.message.includes("IP address")) {
            console.error("⚠️  DETECTION: Your IP is not whitelisted in MongoDB Atlas!");
        }
        process.exit(1);
    }
};

seedPatient();
