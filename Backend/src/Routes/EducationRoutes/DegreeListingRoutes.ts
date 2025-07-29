import express, { Router, Request, Response, NextFunction } from 'express';
import {
  createDegree,
  getAllDegrees,
  getDegreeById,
  updateDegree,
  deleteDegree,
  getFilterOptions
} from '../../controllers/educationControllers/degreeListingController';
import { imageUpload } from '../../middleware/multerConfig';
import { authMiddleware } from '../../middleware/authMiddleware';

// Define a type for async route handlers
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const router: Router = express.Router();

// Helper to handle async errors
const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route to create a new degree
router.post("/createDegree", authMiddleware, imageUpload.single("image"), asyncHandler(createDegree));

// Route to get all degrees with filters
router.get("/viewDegrees", authMiddleware, asyncHandler(getAllDegrees));

// Route to get a single degree by ID
router.get("/viewDegrees/:id", asyncHandler(getDegreeById));

// Route to update a degree by ID
router.put("/updateDegree/:id", authMiddleware, imageUpload.single("image"), asyncHandler(updateDegree));

// Route to delete a degree by ID
router.delete('/deleteDegree/:id', authMiddleware, asyncHandler(deleteDegree));

// Route to get filter options
router.get("/filters", asyncHandler(getFilterOptions));

export default router;