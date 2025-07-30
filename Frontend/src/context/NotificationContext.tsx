import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initiateSocket, getSocket } from '../Components/MessageBox/socket';

interface NotificationContextType {
  unreadCount: number;
  unreadCountsBySender: { [senderId: string]: number };
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: (senderId: string) => void;
  resetUnreadCount: (senderId?: string) => void;
  markMessageAsRead: (senderId: string) => void;
  initializeUnreadCounts: (counts: { [senderId: string]: number }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [unreadCountsBySender, setUnreadCountsBySender] = useState<{ [senderId: string]: number }>({});
  
  // Calculate total unread count
  const unreadCount = Object.values(unreadCountsBySender).reduce((total, count) => total + count, 0);

  const incrementUnreadCount = (senderId: string) => {
    setUnreadCountsBySender(prev => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1
    }));
  };

  const resetUnreadCount = (senderId?: string) => {
    if (senderId) {
      // Reset count for specific sender
      setUnreadCountsBySender(prev => {
        const newCounts = { ...prev };
        delete newCounts[senderId];
        return newCounts;
      });
    } else {
      // Reset all counts
      setUnreadCountsBySender({});
    }
  };

  const markMessageAsRead = (senderId: string) => {
    setUnreadCountsBySender(prev => {
      const newCounts = { ...prev };
      if (newCounts[senderId] && newCounts[senderId] > 0) {
        newCounts[senderId] = Math.max(0, newCounts[senderId] - 1);
        if (newCounts[senderId] === 0) {
          delete newCounts[senderId];
        }
      }
      return newCounts;
    });
  };

  const initializeUnreadCounts = (counts: { [senderId: string]: number }) => {
    setUnreadCountsBySender(prev => {
      const newCounts = { ...prev };
      Object.entries(counts).forEach(([senderId, count]) => {
        if (count > 0) {
          newCounts[senderId] = count;
        } else {
          delete newCounts[senderId];
        }
      });
      return newCounts;
    });
  };

  const setUnreadCount = (count: number) => {
    // This is kept for backward compatibility but now uses the per-sender system
    console.warn('setUnreadCount is deprecated. Use incrementUnreadCount or resetUnreadCount instead.');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1';
    initiateSocket(userId);
    const socket = getSocket();
    
    if (!socket) return;

    // Listen for new messages
    socket.on('receive_message', (data: any) => {
      // Extract sender ID from the message data
      const senderId = data.from || data.senderId || 'unknown';
      if (senderId !== userId) { // Don't count own messages
        incrementUnreadCount(senderId);
      }
    });

    // Listen for message read events
    socket.on('message_read', (data: any) => {
      const senderId = data.from || data.senderId || 'unknown';
      markMessageAsRead(senderId);
    });

    return () => {
      socket?.off('receive_message');
      socket?.off('message_read');
    };
  }, []);

  const value: NotificationContextType = {
    unreadCount,
    unreadCountsBySender,
    setUnreadCount,
    incrementUnreadCount,
    resetUnreadCount,
    markMessageAsRead,
    initializeUnreadCounts,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};