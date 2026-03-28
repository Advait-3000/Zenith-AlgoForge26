import vision from "@google-cloud/vision";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializes the Google Cloud Vision client using an explicit absolute path to the key.
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../config/key.json"),
});

/**
 * Performs OCR text extraction on a remote image URL.
 * @param {string} imageUrl - The publicly accessible URL of the image (e.g., Cloudinary URL).
 * @returns {Promise<string>} - The raw extracted text from the document.
 */
export const performOcrOnImageUrl = async (imageUrl) => {
  try {
    // Calling the Vision API's textDetection method
    console.log("🔍 Triggering Google Vision OCR on:", imageUrl);
    const start = Date.now();
    const [result] = await client.textDetection(imageUrl);
    console.log(`✅ Vision API responded in ${Date.now() - start}ms`);
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return "No readable text detected in the document.";
    }

    // The first element in textAnnotations always contains the fully concatenated string block
    return detections[0].description;
    
  } catch (error) {
    console.error("❌ Google Cloud Vision OCR Error:", error.message);
    throw new Error("Failed to process OCR. Ensure your Google credentials are correct and billing is enabled.");
  }
};
