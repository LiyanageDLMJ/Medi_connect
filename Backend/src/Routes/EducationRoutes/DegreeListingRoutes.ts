import express, { Router, Request, Response, NextFunction } from 'express';
import {
  createDegree,
  getAllDegrees,
  getDegreeById,
  updateDegree,
  deleteDegree,
  getFilterOptions,
} from '../../controllers/educationControllers/degreeListingController';
import {imageUpload} from '../../middleware/multerConfig'; // Import the imageUpload middleware

// Define a type for async route handlers
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const router: Router = express.Router();

// Helper to handle async errors
const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route to view all degrees
router.get('/viewDegrees', asyncHandler(getAllDegrees));

// Route to view a degree by ID
router.get('/viewDegrees/:id', asyncHandler(getDegreeById));

// Route to add a new degree (with image upload middleware)
router.post('/postDegree', imageUpload.single("image"), asyncHandler(createDegree));

// Route to update a degree by ID (also support image upload for updates)
router.put('/updateDegree/:id', imageUpload.single("image"), asyncHandler(updateDegree));

// Route to delete a degree by ID
router.delete('/deleteDegree/:id', asyncHandler(deleteDegree));

// Route to get filter options
router.get('/filters', asyncHandler(getFilterOptions));

export default router;