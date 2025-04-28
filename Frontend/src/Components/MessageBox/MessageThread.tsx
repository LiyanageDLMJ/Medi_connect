import React from 'react';
import './MessageBox.css';

type Message = { id: string; senderId: string; receiverId: string; content: string; timestamp: string };
type User = { id: string; name: string; role: string };

type Props = {
  messages: Message[];
  users: User[];
  currentUserId: string;
};

const MessageThread: React.FC<Props> = ({ messages, users, currentUserId }) => {
  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || 'Unknown';

  return (
    <div className="message-thread">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.senderId === currentUserId ? 'message sent' : 'message received'
          }
        >
          <div className="message-content">{msg.content}</div>
          <div className="message-meta">
            <span>{getUserName(msg.senderId)}</span> |{' '}
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
