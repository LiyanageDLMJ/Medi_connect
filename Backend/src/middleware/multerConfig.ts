import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "image"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
}); 


const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const types = ["image/jpeg", "image/png", "image/jpg"];
    types.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default upload;