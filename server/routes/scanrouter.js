import express from "express";
import { uploadScan } from "../middlewares/upload.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { analyzeMedicalImage } from "../controllers/ai.controller.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

router.post(
  "/upload-scan",
  protect,      // 1. Ensure user is logged in
  authorize("Doctor", "Patient", "Admin"), // 2. RBAC Guard
  uploadScan.single("medical_document"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No medical document was attached to the request." });
      }

      // 4. Manually upload to Cloudinary using memory buffer
      // This fixes the 'Invalid Signature' issue caused by the automated multer storage
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "medical_scans",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      };

      const cloudinaryResult = await uploadToCloudinary();
      const originalFileUrl = cloudinaryResult.secure_url;

      // 🚀 PDF RASTERIZATION TRICK:
      // Google Cloud Vision ONLY accepts remote Image URLs. It crashes if you feed it a remote PDF.
      // But Cloudinary's dynamic API will convert anything to an image if you just change the extension!
      let visionCompatibleUrl = originalFileUrl;
      if (visionCompatibleUrl.toLowerCase().endsWith(".pdf")) {
        visionCompatibleUrl = visionCompatibleUrl.replace(/\.pdf$/i, ".jpg");
      }

      // 5. Trigger Gemini Multimodal Analysis (OCR + Medical Synthesis in one step)
      const patientId = req.body.patientId || req.user.id;
      const uploaderId = req.user.id;

      const aiResult = await analyzeMedicalImage(visionCompatibleUrl);

      return res.status(200).json(aiResult);

    } catch (error) {
      console.error("🚀 PIPELINE CRASHED:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Pipeline failed.",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      });
    }
  }
);

export default router;
