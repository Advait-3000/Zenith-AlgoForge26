import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import { generatePreVisitGuide, classifyEmergencyThreat } from "./ai.controller.js";
import { triggerEmergencyFlow, sendEmergencySMS, sendBookingConfirmation } from "../utilities/twilio_service.js";

/**
 * 📝 BOOK APPOINTMENT (ANTI-GRAVITY ENHANCED)
 */
export const bookAppointment = async (req, res) => {
  try {
    const { patient_id: body_patient_id, facility, facility_name, specialty, time, appointment_time, lat, lng } = req.body;
    
    // 🧠 SMART ID DISCOVERY: Use Body ID ➔ Fallback to Auth Token ID
    const patient_id = body_patient_id || req.user?.id;

    if (!patient_id) {
       console.warn("⚠️ BOOKING REJECTED: No Patient ID provided in Body or Token.");
       return res.status(400).json({ success: false, message: "Patient ID is required. Please provide 'patient_id' in body or login correctly." });
    }

    let final_facility_name = facility_name || facility; 
    let final_specialty = specialty;
    let final_appointment_time = appointment_time || time;
    let triageInfo = null;

    console.log(`\n🚀 [START] Booking Pipeline for Patient: ${patient_id}`);
    console.time("⏱️  Full Pipeline");

    // Ensure DB Connection (Soft log - Mongoose handles buffering automatically)
    if (mongoose.connection.readyState !== 1) {
      console.warn("⏳ [PIPELINE] Database connecting... buffering request.");
    }

    // Capture the booking reason
    const searchReason = req.body.reason || req.body.question;

    // 0. Fetch Patient Profile
    console.time("⏱️  User Fetch");
    const patient = await User.findById(patient_id);
    console.timeEnd("⏱️  User Fetch");

    if (!patient) {
        console.error(`❌ USER NOT FOUND in DB: ${patient_id}`);
        return res.status(404).json({ success: false, message: "Patient not found." });
    }

    console.log(`👤 Database Verified: Patient [${patient.full_name}] found.`);

    // 1. AI TRIAGE & EXTRACTION
    if (searchReason && lat !== undefined && lng !== undefined) {
      console.log(`📡 Analyzing: "${searchReason}"...`);
      const contact = patient.patient_details?.emergency_contacts?.[0] || { name: "Guardian", phone: "" };
      
      console.time("⏱️  AI Triage");
      triageInfo = await classifyEmergencyThreat(searchReason, patient.full_name, contact.name, lat, lng);
      console.timeEnd("⏱️  AI Triage");

      console.log(`🤖 Triage Status: ${triageInfo?.status || "UNKNOWN"}`);

      // 2. GEOSPATIAL SEARCH (Skip if facility is manually selected and status is not CRITICAL)
      console.time("⏱️  Geo Search");
      let nearest = null;

      if (!final_facility_name || triageInfo.status === "CRITICAL") {
        let maxDistance = triageInfo.status === "CRITICAL" ? 15000 : 10000;
        let typeFilter = triageInfo.status === "CRITICAL" ? { "doctor_details.workplace_type": "Hospital" } : {};
        let specialtyFilter = triageInfo.payload?.specialty ? { "doctor_details.specialization": triageInfo.payload.specialty } : {};
        
        nearest = await User.findOne({
          role: "Doctor",
          ...typeFilter,
          ...specialtyFilter,
          location_coordinates: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: maxDistance,
            },
          },
        }).select("full_name doctor_details");

        // Specialty Fallback
        if (!nearest && triageInfo.payload?.specialty && triageInfo.payload.specialty !== "General Physician") {
          nearest = await User.findOne({
            role: "Doctor",
            "doctor_details.specialization": "General Physician",
            location_coordinates: {
              $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: maxDistance },
            },
          }).select("full_name doctor_details");
        }

        // Resilience Fallback
        if (!nearest && triageInfo.status === "CRITICAL") {
          nearest = await User.findOne({
            role: "Doctor",
            location_coordinates: {
              $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 15000 },
            },
          }).select("full_name doctor_details");
        }
      }
      console.timeEnd("⏱️  Geo Search");

      if (nearest) {
        final_facility_name = nearest.doctor_details?.workplace_name || nearest.full_name;
        final_specialty = nearest.doctor_details?.specialization || "General Medicine";
        final_appointment_time = final_appointment_time || new Date().toISOString();
        console.log(`✅ Auto-Found Nearest: ${final_facility_name}`);
      }
    }

    // 3. AI PREP GUIDE
    console.time("⏱️  AI Concierge");
    const aiInsights = await generatePreVisitGuide(final_specialty, final_facility_name);
    if (triageInfo) {
      aiInsights.status = triageInfo.status;
      aiInsights.instruction = triageInfo.instruction;
      aiInsights.symptom_extracted = triageInfo.payload?.symptom;
    }
    console.timeEnd("⏱️  AI Concierge");

    // 4. DATABASE SAVE
    console.time("⏱️  Appointment Create");
    const newAppointment = await Appointment.create({
      patient_id,
      facility_name: final_facility_name,
      specialty: final_specialty,
      appointment_date: final_appointment_time, 
      location_coordinates: { type: "Point", coordinates: [lng, lat] },
      ai_concierge: aiInsights,
      status: "Confirmed",
    });
    console.timeEnd("⏱️  Appointment Create");

    // 🚨 SOS ALERTS (Async)
    if (triageInfo?.status === "CRITICAL") {
      console.log(`🚨 [DB VERIFY] Emergency Protocol for ${patient.full_name}...`);
      const contacts = patient.patient_details?.emergency_contacts || [];
      
      if (contacts.length === 0) {
        console.warn(`⚠️ NO EMERGENCY CONTACTS found in DB for ${patient.full_name}.`);
      } else {
        console.log(`📞 Found ${contacts.length} Emergency Contacts in DB:`, contacts.map(c => c.name).join(", "));
      }
      
      // Robust Fallback Data for Twilio Flow
      const contactName = triageInfo.payload?.contact_name || "Guardian";
      const patientNameForTwilio = triageInfo.payload?.patient_name || patient.full_name || "A patient";
      const symptomForTwilio = triageInfo.payload?.symptom || searchReason || "Medical Emergency";

      console.log(`📡 Preparing Twilio Payload for ${contacts.length} contacts...`);
      
      contacts.forEach(c => {
        if (c.phone) {
          console.log(`📲 Triggering Alert for: ${c.name} (${c.phone})`);
          triggerEmergencyFlow(c.phone, contactName, patientNameForTwilio, symptomForTwilio, lat, lng);
          sendEmergencySMS(c.phone, contactName, patientNameForTwilio, symptomForTwilio, lat, lng);
        } else {
          console.warn(`⚠️ Contact [${c.name}] found without phone number, skipping alert.`);
        }
      });
    }

    // 📩 UNIVERSAL CONFIRMATION (Async)
    if (patient.contact_number) {
        sendBookingConfirmation(patient.contact_number, patient.full_name, final_specialty, final_facility_name, final_appointment_time);
    }

    console.timeEnd("⏱️  Full Pipeline");
    console.log(`🏁 [DONE] Booking Successful for ${patient_id}\n`);

    return res.status(201).json({
      success: true,
      message: triageInfo?.status === "CRITICAL" ? "Emergency Auto-Booking confirmed." : "Appointment confirmed.",
      appointment: newAppointment,
      ai_concierge: aiInsights
    });

  } catch (error) {
    console.error("❌ [PIPELINE ERROR]:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error during booking.", error: error.message });
  }
};

/**
 * 🕵️‍♂️ GET MY APPOINTMENTS
 */
export const getMyAppointments = async (req, res) => {
  try {
    const { patient_id } = req.query; // Or req.user.id if using auth
    
    if (!patient_id) {
      return res.status(400).json({ success: false, message: "Patient ID is required." });
    }

    const appointments = await Appointment.find({ 
      patient_id, 
      is_deleted: false 
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error("❌ Get Appointments Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
