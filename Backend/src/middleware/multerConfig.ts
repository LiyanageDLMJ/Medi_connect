// src/config/multer.ts

import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only PDF files are allowed!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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
  }, // Increased to 5MB to match frontend expectation
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

export default upload;