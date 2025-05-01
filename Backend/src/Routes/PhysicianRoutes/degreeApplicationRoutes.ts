// Routes/PhysicianRoutes/DegreeApplicationRoutes.ts
import express from 'express';
import { submitApplication } from '../../controllers/physicianControllers/degreeApplicationController.ts';

const router = express.Router();

// POST route for submitting degree applications
router.post('/apply', (req, res) => {
  submitApplication(req, res).catch(err => {
    console.error('Route handler error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });
});

export default router;