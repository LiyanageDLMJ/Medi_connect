import { Router } from 'express';
import { 
  submitFeedback, 
  getFeedbackList, 
  getAdminFeedbackList, 
  updateFeedbackStatus 
} from '../controllers/feedbackController';

const router = Router();

// Submit feedback
router.post('/submit', submitFeedback);

// Get feedback list (for institutions)
router.get('/list', getFeedbackList);

// Get feedback list (for admin)
router.get('/admin', getAdminFeedbackList);

// Update feedback status (for admin)
router.patch('/:id/status', updateFeedbackStatus);

export default router; 