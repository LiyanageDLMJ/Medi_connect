import React, { createContext, useContext, useState } from 'react';

interface MessageNotificationContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const MessageNotificationContext = createContext<MessageNotificationContextType | undefined>(undefined);

export const MessageNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  return (
    <MessageNotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </MessageNotificationContext.Provider>
  );
};

export const useMessageNotification = () => {
  const context = useContext(MessageNotificationContext);
  if (!context) {
    throw new Error('useMessageNotification must be used within a MessageNotificationProvider');
  }
  return context;
}; 