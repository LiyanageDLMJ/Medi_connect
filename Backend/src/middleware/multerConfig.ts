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
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

export default upload;