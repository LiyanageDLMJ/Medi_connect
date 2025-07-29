import { Router } from 'express';
import { 
  submitFeedback, 
  getFeedbackList, 
  getAdminFeedbackList, 
  updateFeedbackStatus 
} from '../controllers/feedbackController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Submit feedback (requires authentication)
router.post('/submit', authMiddleware, submitFeedback);

// Get feedback list (for institutions)
router.get('/list', getFeedbackList);

// Get feedback list (for admin)
router.get('/admin', getAdminFeedbackList);

// Update feedback status (for admin)
router.patch('/:id/status', updateFeedbackStatus);

export default router; 