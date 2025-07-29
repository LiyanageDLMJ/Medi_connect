// Routes/PhysicianRoutes/DegreeApplicationRoutes.ts
import express from 'express';
import { submitApplication, getCvFile } from '../../controllers/physicianControllers/degreeApplicationController.ts';
import upload from '../../middleware/multerConfig';

const router = express.Router();

// Define AsyncRequestHandler type
type AsyncRequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// POST route for submitting degree applications (with CV upload)
router.post('/apply', upload.single('cv'), asyncHandler(async (req, res) => {
  await submitApplication(req, res);
}));

// GET route for serving CV files
router.get('/cv/:cvUrl(*)', asyncHandler(async (req, res) => {
  await getCvFile(req, res);
}));

export default router;