import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from '../controllers/notificationController';

const router = express.Router();

// Get user notifications
router.get('/:userId', authMiddleware, getUserNotifications);

// Get unread count
router.get('/:userId/unread', authMiddleware, getUnreadCount);

// Mark notification as read
router.patch('/:notificationId/read', authMiddleware, markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', authMiddleware, markAllAsRead);

// Delete notification
router.delete('/:notificationId', authMiddleware, deleteNotification);

export default router; 