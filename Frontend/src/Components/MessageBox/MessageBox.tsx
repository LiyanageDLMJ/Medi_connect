import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import ConversationHeader from './ConversationHeader';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import ProfilePanel from './ProfilePanel';
import toast from 'react-hot-toast';
import './MessageBox.css';
import { initiateSocket, getSocket, disconnectSocket } from './socket';

// User type includes companyName for recruiters
export type User = { id: string; name: string; userType: string; email: string; companyName?: string; photoUrl?: string };

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  timestamp: string;
}

const API_BASE = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : window.location.origin;

// ConfirmModal component
const ConfirmModal: React.FC<{ open: boolean; onConfirm: () => void; onCancel: () => void; message: string }> = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>{message}</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 18px', borderRadius: 6 }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: '#ef4444', color: '#fff', padding: '8px 18px', borderRadius: 6, fontWeight: 600 }}>Yes, clear</button>
        </div>
      </div>
    </div>
  );
};

const MessageBox: React.FC = () => {
  // Always get current userId from localStorage
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || '');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: string]: number }>({});
  const [showProfile, setShowProfile] = useState(true); // Changed to true to show by default
  const [lastReadTimestamps, setLastReadTimestamps] = useState<{ [userId: string]: string }>({});
  const [showClearModal, setShowClearModal] = useState(false);

  const showToastMessage = (message: string) => {
    toast(message);
  };

  // Fetch users on mount
  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then(res => res.json())
      .then((data: any[]) => {
        // For recruiters, use companyName as name if name is empty
        const mapped: User[] = data.map(u => ({
          id: u._id,
          name: u.userType === 'Recruiter' ? (u.companyName || 'Unnamed') : (u.name || 'Unnamed'),
          userType: u.userType,
          email: u.email,
          companyName: u.companyName || undefined,
          photoUrl: u.photoUrl || undefined,
        }));
        
        // Filter out users with missing names/company names
        const validUsers = mapped.filter(u => {
          if (u.id === currentUserId) return false; // Exclude current user
          if (u.userType === 'Recruiter') {
            return u.companyName && u.companyName.trim() !== '' && u.companyName !== 'Unnamed';
          } else {
            return u.name && u.name.trim() !== '' && u.name !== 'Unnamed';
          }
        });
        
        setUsers(validUsers);
        // Pre-select first peer if none chosen
        const firstPeer = validUsers[0]?.id;
        if (firstPeer) setSelectedUserId(firstPeer);
      })
      .catch(console.error);
  }, [currentUserId]);

  // Calculate unread counts from existing messages and lastReadTimestamps
  useEffect(() => {
    if (!currentUserId || messages.length === 0) return;
    const newUnreadCounts: { [userId: string]: number } = {};
    users.forEach(user => {
      if (user.id === currentUserId) return;
      const conversationMessages = messages.filter(
        m => (m.senderId === currentUserId && m.receiverId === user.id) ||
             (m.senderId === user.id && m.receiverId === currentUserId)
      );
      const lastRead = lastReadTimestamps[user.id];
      const unread = conversationMessages.filter(m =>
        m.senderId === user.id && (!lastRead || new Date(m.timestamp) > new Date(lastRead))
      ).length;
      newUnreadCounts[user.id] = user.id === selectedUserId ? 0 : unread;
    });
    setUnreadCounts(newUnreadCounts);
  }, [messages, currentUserId, selectedUserId, users, lastReadTimestamps]);

  // When a conversation is selected, update lastReadTimestamps
  useEffect(() => {
    if (selectedUserId && currentUserId) {
      setLastReadTimestamps(prev => ({ ...prev, [selectedUserId]: new Date().toISOString() }));
    }
  }, [selectedUserId, currentUserId]);

  // Socket setup
  useEffect(() => {
    if (!currentUserId) return;
    initiateSocket(currentUserId);
    const socket = getSocket();
    if (!socket) return;
    socket.on('receive_message', (data: any) => {
      if (data.to !== currentUserId && data.from !== currentUserId) return;
      const incoming: Message = {
        id: data._id || `m${Date.now()}`,
        senderId: data.from,
        receiverId: data.to,
        content: data.message || '',
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        timestamp: data.createdAt || new Date().toISOString(),
      };
      setMessages(prev => {
        const existingMessage = prev.find(m => {
          if (data._id && m.id === data._id) return true;
          if (m.content === incoming.content && 
              m.senderId === incoming.senderId && 
              m.receiverId === incoming.receiverId) {
            const timeDiff = Math.abs(new Date(m.timestamp).getTime() - new Date(incoming.timestamp).getTime());
            return timeDiff < 10000;
          }
          return false;
        });
        if (existingMessage) {
          if (existingMessage.id.startsWith('temp_') && data._id) {
            return prev.map(m => m.id === existingMessage.id ? incoming : m);
          }
          return prev;
        }
        return [...prev, incoming];
      });
      // Only show toast if not currently viewing this conversation
      if (data.from !== currentUserId && data.from !== selectedUserId) {
        const senderName = users.find(u => u.id === data.from)?.name || 'Someone';
        showToastMessage(`New message from ${senderName}`);
      }
    });
    return () => {
      socket.off('receive_message');
      disconnectSocket();
    };
  }, [currentUserId, selectedUserId, users]);

  // Fetch message history when peer changes
  useEffect(() => {
    if (!selectedUserId || !currentUserId) return;
    fetch(`${API_BASE}/messages?user1=${currentUserId}&user2=${selectedUserId}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const history: Message[] = data.map(m => ({
          id: m._id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          content: m.content || '',
          fileUrl: m.fileUrl,
          fileType: m.fileType,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        
        // Merge with existing messages instead of replacing
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = history.filter(m => !existingIds.has(m.id));
          
          // Also check for duplicates by content, sender, receiver, and timestamp
          const allMessages = [...prev];
          newMessages.forEach(newMsg => {
            const isDuplicate = allMessages.some(existing => 
              existing.content === newMsg.content && 
              existing.senderId === newMsg.senderId && 
              existing.receiverId === newMsg.receiverId &&
              Math.abs(new Date(existing.timestamp).getTime() - new Date(newMsg.timestamp).getTime()) < 10000
            );
            if (!isDuplicate) {
              allMessages.push(newMsg);
            }
          });
          
          return allMessages;
        });
        
        // setUnreadCounts(prev => { // This line is now handled by the useEffect above
        //   const newCounts = { ...prev, [selectedUserId]: 0 };
        //   console.log('Removing badge after loading messages for:', selectedUserId, 'New counts:', newCounts);
        //   return newCounts;
        // });
      })
      .catch(console.error);
  }, [selectedUserId, currentUserId]);

  // Send message
  const handleSendMessage = async (text: string, file?: { url: string; type: string }) => {
    const socket = getSocket();
    if (!socket || !selectedUserId || !currentUserId) return;
    try {
      // Create a temporary message for immediate display
      const tempMessage: Message = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: text,
        fileUrl: file?.url,
        fileType: file?.type,
        timestamp: new Date().toISOString(),
      };
      
      // Add message to state immediately for sender
      setMessages(prev => [...prev, tempMessage]);
      
      // Save to DB
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedUserId,
          content: text,
          fileUrl: file?.url,
          fileType: file?.type,
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      
      // Emit over socket
      socket.emit('send_message', {
        to: selectedUserId,
        from: currentUserId,
        message: text,
        fileUrl: file?.url,
        fileType: file?.type,
        userType: users.find(u => u.id === currentUserId)?.userType || localStorage.getItem('userType') || '',
      });
    } catch (err) {
      showToastMessage('Failed to send message. Please try again.');
    }
  };

  // Filter current conversation and sort by timestamp
  const conversationMessages = messages
    .filter(
      m =>
        (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
        (m.senderId === selectedUserId && m.receiverId === currentUserId),
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Sort users by most recent message timestamp
  const sortedUsers = [...users].sort((a, b) => {
    const aMsg = messages
      .filter(m => (m.senderId === a.id && m.receiverId === currentUserId) || (m.senderId === currentUserId && m.receiverId === a.id))
      .sort((m1, m2) => new Date(m2.timestamp).getTime() - new Date(m1.timestamp).getTime())[0];
    const bMsg = messages
      .filter(m => (m.senderId === b.id && m.receiverId === currentUserId) || (m.senderId === currentUserId && m.receiverId === b.id))
      .sort((m1, m2) => new Date(m2.timestamp).getTime() - new Date(m1.timestamp).getTime())[0];
    if (aMsg && bMsg) {
      return new Date(bMsg.timestamp).getTime() - new Date(aMsg.timestamp).getTime();
    }
    if (aMsg) return -1;
    if (bMsg) return 1;
    return 0;
  });

  const selectedUser = users.find(u => u.id === selectedUserId);

  // Handle conversation selection
  const handleConversationSelect = (userId: string) => {
    console.log('Selecting conversation with:', userId);
    setSelectedUserId(userId);
    // Reset unread count for the selected conversation
    // setUnreadCounts(prev => { // This line is now handled by the useEffect above
    //   const newCounts = { ...prev, [userId]: 0 };
    //   console.log('Removing badge for user:', userId, 'New counts:', newCounts);
    //   return newCounts;
    // });
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      console.log('Attempting to delete message with ID:', id);
      
      // Don't try to delete temporary messages (they don't exist in the database)
      if (id.startsWith('temp_') || id.startsWith('m')) {
        console.log('Deleting temporary message locally');
        setMessages(prev => prev.filter(m => m.id !== id));
        showToastMessage('Message deleted');
        return;
      }

      console.log('Sending delete request to:', `${API_BASE}/messages/${id}`);
      const res = await fetch(`${API_BASE}/messages/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Delete error response:', errorData);
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to delete message`);
      }
      
      const responseData = await res.json().catch(() => ({}));
      console.log('Delete success response:', responseData);
      
      // Remove the message from local state
      setMessages(prev => prev.filter(m => m.id !== id));
      showToastMessage('Message deleted successfully');
    } catch (err: any) {
      console.error('Delete message error:', err);
      showToastMessage(err.message || 'Failed to delete message');
    }
  };

  const handleClearChat = async () => {
    if (!currentUserId || !selectedUserId) return;
    setShowClearModal(true);
  };

  const confirmClearChat = async () => {
    setShowClearModal(false);
    if (!currentUserId || !selectedUserId) return;
    try {
      const res = await fetch(`${API_BASE}/messages?user1=${currentUserId}&user2=${selectedUserId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear chat');
      setMessages(prev => prev.filter(m =>
        !((m.senderId === currentUserId && m.receiverId === selectedUserId) ||
          (m.senderId === selectedUserId && m.receiverId === currentUserId))
      ));
      showToastMessage('Chat cleared');
    } catch (err) {
      showToastMessage('Failed to clear chat');
    }
  };

  return (
    <>
      <div className="message-box-container">
        <ConversationList
          users={sortedUsers}
          selectedUserId={selectedUserId}
          setSelectedUserId={handleConversationSelect}
          addUser={u => {
            // Only add users with valid names/company names
            const isValidUser = u.userType === 'Recruiter' 
              ? (u.companyName && u.companyName.trim() !== '' && u.companyName !== 'Unnamed')
              : (u.name && u.name.trim() !== '' && u.name !== 'Unnamed');
            
            if (isValidUser && !users.find(ex => ex.id === u.id)) {
              setUsers(prev => [...prev, { ...u, email: (u as any).email || '' }]);
            }
          }}
          unreadCounts={unreadCounts}
          messages={messages}
          currentUserId={currentUserId}
        />
        <div className="message-thread-section">
          <ConversationHeader 
            user={selectedUser} 
            onProfileClick={() => setShowProfile(true)}
            showProfile={showProfile}
            onToggleProfile={() => setShowProfile(!showProfile)}
            onClearChat={handleClearChat}
          />
          <ConfirmModal
            open={showClearModal}
            onConfirm={confirmClearChat}
            onCancel={() => setShowClearModal(false)}
            message="Are you sure you want to clear all messages in this chat?"
          />
          <MessageThread
            messages={conversationMessages}
            users={[...users, { id: currentUserId, name: 'You', userType: '', email: '' }]}
            currentUserId={currentUserId}
            onDeleteMessage={handleDeleteMessage}
          />
          <MessageInput onSend={handleSendMessage} />
        </div>
        {showProfile && (
          <ProfilePanel 
            user={selectedUser} 
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </>
  );
};

export default MessageBox;