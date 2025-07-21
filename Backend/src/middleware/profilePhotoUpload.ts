import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads directory if it doesn't exist
const uploadDir = './uploads/profile';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Profile photo upload configuration
const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profilePhotoUpload = multer({
  storage: profilePhotoStorage,
  fileFilter: (req, file, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit for profile photos
  }
});

export default profilePhotoUpload; 