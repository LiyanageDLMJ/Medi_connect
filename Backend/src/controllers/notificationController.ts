import { Request, Response } from 'express';
import { getNotificationModel } from '../models/Notification';
import { io } from '../socketServer';

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const query: any = { userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await getNotificationModel()
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await getNotificationModel().countDocuments(query);
    const unreadCount = await getNotificationModel().countDocuments({ userId, read: false });

    res.json({
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await getNotificationModel().findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit updated unread count to user
    const unreadCount = await getNotificationModel().countDocuments({ userId, read: false });
    io.to(userId).emit('notification_updated', { 
      type: 'mark_read', 
      notificationId, 
      unreadCount 
    });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    await getNotificationModel().updateMany(
      { userId, read: false },
      { read: true }
    );

    // Emit updated unread count to user
    io.to(userId).emit('notification_updated', { 
      type: 'mark_all_read', 
      unreadCount: 0 
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const count = await getNotificationModel().countDocuments({ userId, read: false });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
};

// Create notification (for internal use)
export const createNotification = async (
  userId: string,
  userType: string,
  title: string,
  message: string,
  type: 'application_status' | 'new_degree' | 'deadline_reminder' | 'system_announcement',
  relatedData?: any
) => {
  try {
    const notification = new (getNotificationModel())({
      userId,
      userType,
      title,
      message,
      type,
      relatedData
    });

    await notification.save();

    // Emit real-time notification to user
    const unreadCount = await getNotificationModel().countDocuments({ userId, read: false });
    io.to(userId).emit('new_notification', {
      notification: notification.toObject(),
      unreadCount
    });

    console.log(`Real-time notification sent to user ${userId}:`, title);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await getNotificationModel().findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit updated unread count to user
    const unreadCount = await getNotificationModel().countDocuments({ userId, read: false });
    io.to(userId).emit('notification_updated', { 
      type: 'delete', 
      notificationId, 
      unreadCount 
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
}; 