import React, { useState, useEffect, useRef } from 'react';
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
  const threadRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper to get lastReadTimestamp for a user
  const getLastReadTimestamp = (userId: string) => {
    try {
      const stored = localStorage.getItem('lastReadTimestamps');
      if (stored) {
        const obj = JSON.parse(stored);
        return obj[userId];
      }
    } catch {}
    return undefined;
  };

  // Helper to get message status
  const getMessageStatus = (msg: Message) => {
    if (msg.id.startsWith('temp_')) return 'sent';
    if (msg.id.startsWith('m')) return 'delivered';
    // Read: if receiver's lastReadTimestamp is after this message
    const lastRead = getLastReadTimestamp(msg.receiverId);
    if (lastRead && new Date(lastRead) > new Date(msg.timestamp)) return 'read';
    return 'delivered';
  };

  const statusIcon = (status: string) => {
    if (status === 'sent') return <span title="Sent">✓</span>;
    if (status === 'delivered') return <span title="Delivered">✓✓</span>;
    if (status === 'read') return <span title="Read" style={{ color: '#3b82f6' }}>✓✓</span>;
    return null;
  };

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
    <div className="message-thread" ref={threadRef} onClick={() => setSelectedMsgId(null)}>
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
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '48px' // Further increased gap below the info text
        }}>
          💡 Click on your messages to delete them
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            (msg.senderId === currentUserId ? 'message sent' : 'message received') + ' fade-in-message'
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
            {/* Show status ticks for sent messages */}
            {msg.senderId === currentUserId && (
              <span className="read-receipt" style={{ marginLeft: 6 }}>{statusIcon(getMessageStatus(msg))}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
