import multer from "multer";

// Use in-memory storage instead of multer-storage-cloudinary
// to avoid signature computation issues with the Cloudinary SDK.
// The actual Cloudinary upload is now handled manually in the route handler.
const storage = multer.memoryStorage();

export const uploadScan = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, JPEG, and PDF files are allowed."));
    }
  },
});
