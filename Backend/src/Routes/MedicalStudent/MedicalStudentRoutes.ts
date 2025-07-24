import express from 'express';
import { generateStudentCV } from '../../services/CvGenerator';
import CvTemplate from '../../models/CvTemplate';
import StudentCv from '../../models/StudentCv';

const router = express.Router();

// Get all templates
router.get('/templates', async (req, res) => {
  const templates = await CvTemplate.find();
  res.json(templates);
});

// Create new CV
router.post('/create', async (req, res) => {
  const { userId, templateId, data } = req.body;
  
  try {
    // Generate and save PDF
    const pdfUrl = await generateStudentCV(templateId, data, userId);
    
    // Save to database
    const newCv = new StudentCv({ userId, templateId, data, pdfUrl });
    await newCv.save();
    
    res.status(201).json({ pdfUrl });
  } catch (error) {
    res.status(500).json({ error: 'CV generation failed' });
  }
});

export default router;