import { encryptText } from "../utilities/cryptoutils.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import MedicalRecord from "../models/reports.model.js";
import { v2 as cloudinary } from "cloudinary";
import Redis from "ioredis";
import sharp from "sharp";
import crypto from "crypto";

// Initialize Redis with a graceful fail-safe
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => null, // Don't retry indefinitely
});

redis.on("error", (err) => {
  console.warn("⚠️ Redis not available - results will not be cached.");
});

// Configure Cloudinary for manual uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize NLP model using your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to convert remote URL to Part for Gemini with Inline Compression & PDF Support
async function urlToGenerativePart(url) {
  try {
    if (!url) throw new Error("Document URL is required but received undefined.");
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch document: ${response.statusText}`);
    
    // Detect MIME type from the response or URL extension
    const contentType = response.headers.get("content-type") || (url.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
    console.log(`🔍 Detected Content-Type for ingestion: ${contentType}`);
    
    let arrayBuffer = await response.arrayBuffer();
    
    // 🔥 OPTIMIZATION: Only compress if it's an IMAGE. We don't compress PDFs locally.
    if (contentType.startsWith("image/") && arrayBuffer.byteLength > 500 * 1024) {
      console.log(`🖼️  Compressing large image (${(arrayBuffer.byteLength/1024).toFixed(1)} KB)...`);
      const compressedBuffer = await sharp(Buffer.from(arrayBuffer))
        .resize(1600, 1600, { fit: "inside" })
        .jpeg({ quality: 80 }) 
        .toBuffer();
      arrayBuffer = compressedBuffer;
      console.log(`✅ Compressed to ${(compressedBuffer.byteLength/1024).toFixed(1)} KB`);
    }
    
    return {
      inlineData: {
        data: Buffer.from(arrayBuffer).toString("base64"),
        mimeType: contentType
      },
    };
  } catch (error) {
    console.error("❌ Document Fetch/Processing Error:", error.message);
    throw error;
  }
}

// Helper to upload a text summary to Cloudinary as a RAW file
async function uploadSummaryToCloudinary(summaryText, patientName) {
  try {
    if (!summaryText) throw new Error("summaryText is missing for Cloudinary upload");
    
    const buffer = Buffer.from(summaryText, 'utf-8');
    const base64Data = buffer.toString('base64');
    const fileName = `summary_${(patientName || "Patient").replace(/\s+/g, "_")}_${Date.now()}.txt`;
    
    console.log(`📡 Uploading summary to Cloudinary: ${fileName} (${buffer.length} bytes)`);
    
    const result = await cloudinary.uploader.upload(`data:text/plain;base64,${base64Data}`, {
      resource_type: "raw",
      public_id: `medical_reports/summaries/${fileName}`,
    });
    
    console.log("✅ Summary uploaded successfully:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
}

export const analyzeMedicalImage = async (uploaderId, patientId, fileUrl) => {
  const cacheKey = `scan_result:${crypto.createHash("md5").update(fileUrl).digest("hex")}`;
  
  // ⚡ REDIS CACHE CHECK
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("⚡ [CACHE HIT] Returning results from Redis...");
      return JSON.parse(cachedData);
    }
  } catch (err) {
    // Fail silently, proceed with AI scan
  }

  let model;
  try {
    // Diagnosed authorized model: gemini-2.5-flash
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  } catch (initError) {
    console.error("⚠️ Gemini Initialization Warning:", initError.message);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  try {
    // 1. Prepare Multimodal Payload (Supports Image & PDF)
    const documentPart = await urlToGenerativePart(fileUrl);

    // 2. Prompt Engineering: Expert Clinical Data Parser Architecture
    const prompt = `
      ### ROLE
      Expert Clinical Data Parser & Pathologist Assistant.

      ### OBJECTIVE
      Analyze EVERY PAGE of the provided medical document (multi-page PDF or Image). 
      You must process the entire context from start to finish. Identify every single result that is outside its biological reference range across ALL pages.

      ### EXTRACTION ARCHITECTURE (ANTI-GRAVITY RULES)
      1. DATA ANCHORING: For every test, locate the "Result" and the "Biological Ref. Interval." If the Result is higher (H), lower (L), or flagged as "Present/Positive," it is a MANDATORY extraction.
      2. NO-NOISE ZONE: Administrative text (lab addresses, page numbers, disclaimer footers) should be ignored FOR CONTEXT, but DO NOT let them obscure clinical results located near them.
      3. TABULAR RECONSTRUCTION: If a table is broken across pages, mentally stitch the "Test Name" to its "Result" across the OCR break. Process the document as a continuous flow.
      4. EXHAUSTIVE RISK DETECTION: Do not summarize or skip pages. Every abnormal finding must be listed in Primary Clinical Concerns.

      ### OUTPUT JSON STRUCTURE
      You must return ONLY a JSON object with this exact structure:
      {
        "primary_clinical_concerns": [
          { "category": "Hematology", "test_name": "Hemoglobin", "result": "10.5", "unit": "g/dL", "reference_range": "12-16", "implication": "Moderate Anemia" }
        ],
        "secondary_findings": [
          { "category": "Vitamins", "test_name": "Vitamin D", "result": "25", "unit": "ng/mL", "reference_range": "30-100" }
        ],
        "stable_systems": ["Renal", "Liver Function", "Electrolytes"],
        "patient_details": { "name": "...", "age": "...", "gender": "...", "pid": "..." },
        "lab_details": { "name": "...", "location": "...", "sample_date": "YYYY-MM-DDTHH:mm:ssZ" },
        "clinical_data": { 
           "Test Name": "Value Unit (Ref Range)"
        },
        "ocr_raw_text": "Cleanly transcribed text...",
        "concise_summary": "Simplified executive summary for the patient.",
        "patient_translation": "Layman translation of findings.",
        "calculated_health_score": "[DYNAMIC_SCORE_0_TO_100]",
        "score_factors": ["List each clinical reason for this specific score"]
      }
      
      SCORING RUBRIC (PROHIBITED: DO NOT ALWAYS RETURN 75):
      - Start at 100 points.
      - Deduct 10-20 points for every "Primary Clinical Concern" (Severity dependent).
      - Deduct 5 points for every "Secondary Finding."
      - If ALL markers are in reference range, return 95-100.
      
      Return ONLY the raw JSON object. Do not include markdown code blocks.
    `;

    // 3. Transform Data via Multimodal Gemini
    console.log("🤖 Sending document to Gemini for Multimodal Analysis...");
    const aiStart = Date.now();
    const result = await model.generateContent([prompt, documentPart]);
    console.log("✅ Gemini Multimodal responded in " + (Date.now() - aiStart) + "ms");
    
    const aiResponseString = result.response.text().trim();
    console.log("📝 Raw Gemini Response (First 100 chars):", aiResponseString.substring(0, 100));
    
    // Robust Parsing: Strip markdown code blocks if the AI included them
    const cleanJson = aiResponseString.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
    
    // Parse the unstructured LLM text back into a strict JS object
    const structuredAnalysis = JSON.parse(cleanJson);
    console.log("🧩 Parsed Analysis Keys:", Object.keys(structuredAnalysis));
    
    // Extract raw text for separate encryption field
    const rawOcrText = structuredAnalysis.ocr_raw_text || "Text extraction produced no results.";
    delete structuredAnalysis.ocr_raw_text; 

    // 4. Generate and Upload Summary File to Cloudinary
    const patientName = structuredAnalysis.patient_details?.name || "Patient";
    const summaryDocumentContent = `
MEDICAL REPORT SUMMARY
----------------------
Patient: ${patientName}
Age/Sex: ${structuredAnalysis.patient_details?.age || "N/A"} / ${structuredAnalysis.patient_details?.gender || "N/A"}
Date: ${structuredAnalysis.lab_details?.sample_date || new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
${structuredAnalysis.concise_summary || "No summary provided."}

KEY FINDINGS:
${(structuredAnalysis.detected_abnormalities || []).map(a => "- " + a).join("\n") || "No specific abnormalities detected."}

LAYMAN TRANSLATION:
${structuredAnalysis.patient_translation || "N/A"}

HEALTH SCORE: ${structuredAnalysis.calculated_health_score || "N/A"}/100
FACTORS: ${(structuredAnalysis.score_factors || []).join(", ") || "N/A"}
    `;

    console.log("📄 Preparing Cloudinary Upload for:", patientName);
    console.log("📦 Summary Length:", summaryDocumentContent.length);
    console.log("👤 PatientID:", patientId, "UploaderID:", uploaderId);

    const summaryFileUrl = await uploadSummaryToCloudinary(summaryDocumentContent, patientName);

    structuredAnalysis.summary_file_url = summaryFileUrl;

    // 5. PERSIST TO DATABASE (with independent error handling)
    let newRecord = null;
    try {
      console.log("💾 Attempting to persist record to MongoDB...");
      newRecord = await MedicalRecord.create({
        patient_id: patientId,
        uploaded_by: uploaderId,
        document_type: "Scan",
        s3_file_url: fileUrl,
        ocr_extracted_text: encryptText(rawOcrText),
        ai_analysis: structuredAnalysis
      });
      console.log("✅ Record persisted successfully with ID:", newRecord._id);
    } catch (dbError) {
      console.error("⚠️ Database Persistence Failed:", dbError.message);
      // We don't throw here so we can still return the AI results to the user
    }

    const finalResult = {
      success: true,
      message: newRecord 
        ? "Medical record analyzed and stored successfully." 
        : "Medical record analyzed, but failed to save to database (Connectivity issue).",
      record_id: newRecord?._id || null,
      summary_url: summaryFileUrl,
      analysis: structuredAnalysis
    };

    // ⚡ CACHE THE FINAL RESULT (Expire in 24 hours)
    try {
      await redis.set(cacheKey, JSON.stringify(finalResult), "EX", 86400);
    } catch (err) {}

    return finalResult;

  } catch (error) {
    console.error("❌ Pipeline Error:", error.message);
    // Return the actual error message so the user can debug in Postman
    throw new Error(error.message || "Failed to process medical image through AI engine.");
  }
};
