// src/config/multer.ts

import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Choose one of these storage options (comment out the one you're not using)

// OPTION 1: Disk Storage (saves files to disk first)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// OPTION 2: Memory Storage (keeps files in memory as buffers)
// const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed") as any);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    console.log(`Uploading file: ${file.originalname}, Size: ${file.size} bytes, Type: ${file.mimetype}`); // Debug log
    const types = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, JPG, WebP) are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB to match frontend expectation
});

export default upload;