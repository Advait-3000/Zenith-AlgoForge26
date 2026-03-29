import User from "../models/user.model.js";
import { emergencyCoordinatorAI, classifyEmergencyThreat } from "./ai.controller.js";

/**
 * 🚨 FIND NEAREST CLINICS (Real-Time Search)
 * Performs a geospatial search for doctors/clinics and triggers AI coordination.
 */
export const findNearestClinics = async (req, res) => {
  try {
    const { lat, lng, reason } = req.body;

    if (lat === undefined || lng === undefined || !reason) {
      return res.status(400).json({ success: false, message: "Coordinates and reason for visit are required." });
    }

    // 1. AI TRIAGE: Classify the threat level
    console.log(`🚑 Triage: Analyzing threat for "${reason}"...`);
    const triage = await classifyEmergencyThreat(reason);
    console.log(`🚥 Triage Result: Level ${triage.threat_level} (${triage.facility_requirement})`);

    // 2. DYNAMIC SEARCH CONFIGURATION
    let maxDistance = 10000; // Default 10km
    let typeFilter = {};

    if (triage.threat_level === 1) {
      maxDistance = 15000; // Expand search for critical care
      typeFilter = { "doctor_details.workplace_type": "Hospital" };
    } else if (triage.threat_level === 3) {
      maxDistance = 5000; // Localized search for routine
      typeFilter = { "doctor_details.workplace_type": "Self-Clinic" };
    }

    // 3. PERFORM GEOSPATIAL SEARCH
    const nearbyDoctors = await User.find({
      role: "Doctor",
      ...typeFilter,
      location_coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      },
    })
    .limit(3)
    .select("full_name doctor_details location_coordinates");

    // 4. TRIGGER EMERGENCY COORDINATOR AI (with Triage Context)
    const mappedFacilities = nearbyDoctors.map(doc => ({
      name: doc.full_name,
      facility: doc.doctor_details?.workplace_name || "Medical Facility",
      type: doc.doctor_details?.workplace_type,
      specialty: doc.doctor_details?.specialization,
      coordinates: doc.location_coordinates.coordinates
    }));

    const aiResponse = await emergencyCoordinatorAI(lat, lng, reason, mappedFacilities);

    res.status(200).json({
      success: true,
      triage,
      ...aiResponse,
      raw_results: mappedFacilities
    });

  } catch (error) {
    console.error("🚀 Emergency Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to perform real-time emergency search.",
      error: error.message
    });
  }
};
