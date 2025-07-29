import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../Config/cloudinaryConfig';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads/chat');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf', 'image/gif', 'image/webp'];

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File missing' });

  // Only upload images to Cloudinary, keep PDFs and others as local
  if (req.file.mimetype.startsWith('image/')) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'chat-images',
        resource_type: 'image',
      });
      // Optionally delete the local file after upload
      fs.unlinkSync(req.file.path);
      return res.json({ fileUrl: result.secure_url });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ message: 'Cloudinary upload failed' });
    }
  } else {
    // For non-image files, keep the old behavior
    const fileUrl = `/uploads/chat/${req.file.filename}`;
    return res.json({ fileUrl });
  }
});

export default router;
