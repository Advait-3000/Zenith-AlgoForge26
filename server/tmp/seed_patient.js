import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedPatient = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("🌱 Connected to MongoDB...");

        const patientEmail = "test_patient@example.com";
        
        // Find or create a test patient
        let patient = await User.findOne({ email: patientEmail });
        
        const patientData = {
            email: patientEmail,
            password_hash: "dummy",
            role: "Patient",
            full_name: "Sahil (Test Patient)",
            location_coordinates: { type: "Point", coordinates: [72.5714, 23.0225] },
            patient_details: {
                emergency_contacts: [
                    {
                        name: "Emergency Contact 1",
                        relation: "Family",
                        phone: "+1234567890" // USER: Replace with your actual phone to test!
                    }
                ]
            }
        };

        if (patient) {
            console.log("🔄 Updating existing test patient...");
            await User.updateOne({ email: patientEmail }, patientData);
        } else {
            console.log("✨ Creating new test patient...");
            await User.create(patientData);
        }

        console.log("✅ Test Patient Seeded with Emergency Contacts!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
        process.exit(1);
    }
};

seedPatient();
