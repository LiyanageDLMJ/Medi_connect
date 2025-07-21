import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File missing' });
  const fileUrl = `/uploads/chat/${req.file.filename}`;
  res.json({ fileUrl });
});

export default router;
