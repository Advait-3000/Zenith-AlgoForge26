import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import https from "https";
import Groq from "groq-sdk";

dotenv.config();

// 🟢 INITIALIZE AI ENGINES
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * 📡 RAW REST API FALLBACK
 */
const rawGeminiRequest = (modelName, prompt, base64Data = null) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const parts = [{ text: prompt }];
    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data
        }
      });
    }

    const payload = JSON.stringify({
      contents: [{ parts }]
    });

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    };

    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0].content) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            console.warn(`⚠️ RAW [${modelName}] failed or empty.`, JSON.stringify(json));
            reject(new Error(`Model ${modelName} failed.`));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on("error", (e) => reject(e));
    req.write(payload);
    req.end();
  });
};

/**
 * 🛠️ RESILIENT MODEL SELECTOR (SDK -> REST -> GROQ)
 */
const getResilientModel = async (prompt, isMultimodal = false, base64Data = null) => {
  // 1. Try Gemini RAW REST (More reliable than SDK URLs)
  const geminis = isMultimodal ? ["gemini-1.5-flash", "gemini-1.5-pro"] : ["gemini-1.5-flash", "gemini-pro"];
  
  for (const modelName of geminis) {
    try {
      console.log(`📡 Trying Gemini REST: ${modelName}...`);
      const result = await rawGeminiRequest(modelName, prompt, base64Data);
      return { response: { text: () => result } };
    } catch (e) { continue; }
  }

  // 2. Try GROQ (Vision Fallback if multimodal)
  try {
    const model = isMultimodal ? "llama-3.2-90b-vision-preview" : "llama-3.3-70b-versatile";
    console.log(`🦾 Gemini failed. Deploying GROQ (${model})...`);
    
    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt }
        ]
      }
    ];

    if (isMultimodal && base64Data) {
      messages[0].content.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${base64Data}` }
      });
    }

    const completion = await groq.chat.completions.create({
      messages,
      model: model,
    });
    const result = completion.choices[0].message.content;
    return { response: { text: () => result } };
  } catch (error) {
    console.error("❌ ALL AI CHANNELS FAILED (Gemini & Groq).", error.message);
    throw new Error("SOS AI OFFLINE. System Triage Fallback engaged.");
  }
};

/**
 * 🗃️ DOWNLOAD IMAGE Helper
 * Downloads remote images and converts them to BASE64 for AI Multimodal input.
 */
const downloadImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("base64"));
      });
      res.on("error", (e) => reject(e));
    });
  });
};

/**
 * 🧪 ANALYZE SCAN (UTILITY)
 * Downloads from Cloudinary, converts to Base64, and runs analysis.
 */
export const analyzeMedicalImage = async (imageUrl) => {
  try {
    if (!imageUrl) throw new Error("No image URL provided for analysis.");

    console.log(`🔄 Downloading & Rasterizing Scan for AI...`);
    const base64Data = await downloadImageToBase64(imageUrl);

    const prompt = `
      ### ROLE
      Expert Medical AI Diagnostic Assistant.
      
      ### TASK
      Analyze the provided medical scan (MRI/X-Ray/CT).
      Identify ANY abnormalities (fractures, tumors, inflammation).
      
      ### OUTPUT FORMAT
      1. Finding: [Clear Description]
      2. Severity: [Critical/Moderate/Low]
      3. SOS Recommended: [Yes/No]
      4. Next Step: [Clinical Action]
    `;

    // 🚀 Uses Resilient Multimodal Logic
    const result = await getResilientModel(prompt, true, base64Data);
    const responseText = result.response.text();

    const isSOS = responseText.toLowerCase().includes("critical") || 
                  responseText.toLowerCase().includes("sos: yes");

    return {
      success: true,
      analysis: responseText,
      threat_detected: isSOS
    };
  } catch (error) {
    console.error("❌ Scan Analysis Error:", error.message);
    return { 
      success: false, 
      message: "AI Analysis failed.", 
      error: error.message 
    };
  }
};

/**
 * 🤖 AI HEALTH CONCIERGE: Generate Pre-Visit Guide
 */
export const generatePreVisitGuide = async (specialty, facilityName) => {
  try {
    const prompt = `
      ### ROLE
      Health Concierge Agent.
      
      ### TASK
      A patient has booked an appointment for [${specialty}] at [${facilityName}].
      Generate a concise, helpful "Preparation Guide" for them.
      
      ### OUTPUT FORMAT (STRICT JSON)
      {
        "reminders": ["Reminder 1", "Reminder 2", "Reminder 3"],
        "importance_note": "A single sentence explaining why this specialty visit is important.",
        "digital_consent_required": true/false
      }
    `;

    const result = await getResilientModel(prompt);
    const responseText = result.response.text().trim();
    
    // Clean JSON if markdown is present
    const cleanJson = responseText.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
    
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (error) {
    console.error("❌ Concierge AI Error:", error.message);
    return {
      reminders: ["Bring ID", "Arrive early", "List medications"],
      importance_note: "Standard health monitoring.",
      digital_consent_required: false
    };
  }
};

/**
 * 🚑 AI EMERGENCY COORDINATOR
 */
export const emergencyCoordinatorAI = async (lat, lng, specialty, nearbyFacilities) => {
  try {
    const prompt = `
      ### ROLE
      Real-Time Emergency Coordinator.
      Track user at: ${lat}, ${lng}. Searching for: ${specialty}.
      Nearby: ${JSON.stringify(nearbyFacilities)}
      
      ### TASK (ANTI-GRAVITY REAL-TIME)
      Provide live ETA and prioritize closest facility within 5 mins.
      
      ### OUTPUT FORMAT (STRICT JSON)
      {
        "status": "Tracking Live",
        "nearest_specialist": {
          "name": "...",
          "distance_km": "...",
          "eta_mins": "..."
        },
        "action_note": "Redirecting your search as you move..."
      }
    `;

    const result = await getResilientModel(prompt);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ Emergency AI Error:", error.message);
    return {
      status: "Tracking Live",
      nearest_specialist: nearbyFacilities[0] || { name: "Searching...", distance_km: "N/A", eta_mins: "N/A" },
      action_note: "Optimizing your route..."
    };
  }
};

/**
 * 🚑 AI MEDICAL DISPATCHER (ANTI-GRAVITY ENGINE)
 */
export const classifyEmergencyThreat = async (userInput, patientName, contactName, lat, lng) => {
  try {
    const prompt = `
      ### ROLE
      Emergency Triage API Handler.

      ### OBJECTIVE
      Analyze the patient's reported symptoms and extract structured data to trigger a Twilio Emergency Flow. 
      You must decide if the situation is a "CRITICAL" emergency or a "ROUTINE" booking.
      Patient Name: ${patientName}
      Emergency Contact Name: ${contactName}
      Location: ${lat}, ${lng}

      ### EXTRACTION RULES (STRICT JSON ONLY)
      1. THREAT ANALYSIS: If the user mentions "chest pain," "breathless," "bleeding," or "stroke," set status to "CRITICAL." 
      2. SAFETY FIRST: If the user sounds confused or stops responding, default to "CRITICAL" urgency.
      3. DATA ANCHORING:
         - Extract the specific 'symptom' (e.g., "Severe Chest Pain").
         - Use the provided 'patient_name' and 'contact_name'.
      4. LOGISTICS: Generate a 'location_link' using the provided GPS coordinates: https://www.google.com/maps?q=${lat},${lng}

      ### OUTPUT FORMAT
      You must output ONLY a valid JSON object. No conversational text.
      {
        "status": "CRITICAL" | "ROUTINE",
        "payload": {
          "contact_name": "string",
          "patient_name": "string",
          "symptom": "string",
          "location_link": "string",
          "specialty": "string (only if status is ROUTINE, recommend a medical specialty)"
        },
        "instruction": "Brief life-saving advice to show in chat."
      }
    `;

    const result = await getResilientModel(prompt);
    const responseText = result.response.text().trim();
    
    // 🧠 ROBUST PARSING: Extract first { ... } block to avoid conversational noise
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
    
    const parsed = JSON.parse(cleanJson);

    // 🛡️ DATA INTEGRITY: Ensure the payload is never empty and matches Twilio expectations
    if (!parsed.payload) parsed.payload = {};
    parsed.payload.contact_name = parsed.payload.contact_name || contactName;
    parsed.payload.patient_name = parsed.payload.patient_name || patientName;
    parsed.payload.symptom = parsed.payload.symptom || userInput;
    parsed.payload.location_link = parsed.payload.location_link || `https://www.google.com/maps?q=${lat},${lng}`;

    return parsed;
  } catch (error) {
    console.error("❌ Dispatcher AI Error:", error.message);
    return {
      status: "CRITICAL", // Safe default
      payload: {
        contact_name: contactName,
        patient_name: patientName,
        symptom: userInput,
        location_link: `https://www.google.com/maps?q=${lat},${lng}`,
        specialty: "General Physician"
      },
      instruction: "Please stay calm. Help is being coordinated."
    };
  }
};
