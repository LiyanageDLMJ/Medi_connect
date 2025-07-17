import express, { Request, Response, RequestHandler } from 'express';
import { 
  getApplications, 
  markAsViewed, 
  updateStatus 
} from '../../controllers/RecuiterControllers/jobApplicationControllerByRecuiter';

const router = express.Router();

// Get all applications
router.get('/getApplications', getApplications as RequestHandler);

// Mark application as viewed
router.patch('/markAsViewed/:id', markAsViewed as RequestHandler);

// Update application status
router.patch('/updateStatus/:id', updateStatus as RequestHandler);

export default router;