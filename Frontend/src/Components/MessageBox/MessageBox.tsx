import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import './MessageBox.css';

// Mock users and messages
type User = { id: string; name: string; role: string };
type Message = { id: string; senderId: string; receiverId: string; content: string; timestamp: string };

const mockUsers: User[] = [
  { id: '1', name: 'Dr. Alice', role: 'doctor' },
  { id: '2', name: 'Med Student Bob', role: 'student' },
  { id: '3', name: 'Recruiter Carol', role: 'recruiter' },
];

const mockMessages: Message[] = [
  { id: 'm1', senderId: '3', receiverId: '1', content: 'You have a new job application!', timestamp: '2025-04-16T12:00:00' },
  { id: 'm2', senderId: '1', receiverId: '3', content: 'Thank you!', timestamp: '2025-04-16T12:01:00' },
];

const currentUserId = '1'; // Example: logged-in user is Dr. Alice

const MessageBox: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('3'); // Default to recruiter
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      senderId: currentUserId,
      receiverId: selectedUserId,
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
  };

  const conversationMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.receiverId === selectedUserId) ||
      (msg.senderId === selectedUserId && msg.receiverId === currentUserId)
  );

  return (
    <div className="message-box-container">
      <ConversationList
        users={mockUsers.filter((u) => u.id !== currentUserId)}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
      <div className="message-thread-section">
        <MessageThread
          messages={conversationMessages}
          users={mockUsers}
          currentUserId={currentUserId}
        />
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default MessageBox;
