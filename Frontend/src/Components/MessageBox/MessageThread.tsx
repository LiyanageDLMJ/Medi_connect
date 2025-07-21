import React, { useState } from 'react';
import './MessageBox.css';

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  timestamp: string;
};
type User = { id: string; name: string; userType: string; companyName?: string };

type Props = {
  messages: Message[];
  users: User[];
  currentUserId: string;
  onDeleteMessage?: (id: string) => void;
};

const MessageThread: React.FC<Props> = ({ messages, users, currentUserId, onDeleteMessage }) => {
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

  const getUserName = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return 'Unknown';
    if (user.userType === 'Recruiter' && user.companyName) return user.companyName;
    return user.name;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="message-thread" onClick={() => setSelectedMsgId(null)}>
      {messages.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          padding: '20px',
          fontSize: '14px'
        }}>
          No messages yet. Start a conversation!
        </div>
      )}
      {messages.length > 0 && messages.some(m => m.senderId === currentUserId) && (
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          padding: '8px',
          fontSize: '12px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb'
        }}>
          💡 Click on your messages to delete them
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.senderId === currentUserId ? 'message sent' : 'message received'
          }
          style={{
            border: msg.senderId === currentUserId && selectedMsgId === msg.id ? '2px solid #ef4444' : 'none',
            boxShadow: msg.senderId === currentUserId && selectedMsgId === msg.id ? '0 0 0 1px #ef4444' : 'none'
          }}
          onClick={e => {
            e.stopPropagation();
            if (msg.senderId === currentUserId) {
              setSelectedMsgId(selectedMsgId === msg.id ? null : msg.id);
            }
          }}
        >
          <div className="message-content">
            {msg.content && <span>{msg.content}</span>}
            {msg.fileUrl && (
              msg.fileType?.startsWith('image/') ? (
                <img src={msg.fileUrl} alt="attachment" style={{ maxWidth: '180px', borderRadius: 8 }} />
              ) : (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                  📄 View Document
                </a>
              )
            )}
            {/* Show delete button only if this message is selected and sent by current user */}
            {msg.senderId === currentUserId && onDeleteMessage && selectedMsgId === msg.id && (
              <button
                className="delete-message-btn"
                title="Delete message"
                onClick={e => {
                  e.stopPropagation();
                  onDeleteMessage(msg.id);
                  setSelectedMsgId(null);
                }}
                style={{ 
                  marginLeft: 8, 
                  background: '#ef4444', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                Delete
              </button>
            )}
          </div>
          <div className="message-meta">
            <span className="message-time">{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
