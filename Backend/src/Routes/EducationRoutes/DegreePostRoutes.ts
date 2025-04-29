import express, { Router, Request, Response, NextFunction } from 'express';
import {
  createDegree,
  getAllDegrees,
  getDegreeById,
  updateDegree,
  deleteDegree,
} from '../../controllers/educationControllers/degreePostController';

// Define a type for async route handlers (same as in degreePostController.ts)
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

// Route to add a new degree
router.post('/postDegree', asyncHandler(createDegree));

// Route to update a degree by ID
router.put('/updateDegree/:id', asyncHandler(updateDegree));

// Route to delete a degree by ID
router.delete('/deleteDegree/:id', asyncHandler(deleteDegree));

export default router;