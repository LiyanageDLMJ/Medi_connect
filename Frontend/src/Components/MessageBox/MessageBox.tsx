import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import ConversationList from './ConversationList';
import ConversationHeader from './ConversationHeader';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import ProfilePanel from './ProfilePanel';
import toast from 'react-hot-toast';
import './MessageBox.css';
import { initiateSocket, getSocket, disconnectSocket } from './socket';
import { useMessageNotification } from '../../context/MessageNotificationContext';

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
  const [showProfile, setShowProfile] = useState(true); // Changed to true to show by default
  const [lastReadTimestamps, setLastReadTimestamps] = useState<{ [userId: string]: string }>({});
  const [showClearModal, setShowClearModal] = useState(false);
  const { setUnreadCount } = useMessageNotification();
  const fetchedUserIdsRef = useRef<Set<string>>(new Set());
  const didInitialRead = useRef(false);

  // New: Store latest messages for chat list sorting
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);

  // Dummy state to force re-render
  const [, forceRerender] = useState(0);

  const showToastMessage = (message: string) => {
    toast(message);
  };

  // Always load lastReadTimestamps from localStorage on every mount BEFORE first render
  useLayoutEffect(() => {
    const stored = localStorage.getItem('lastReadTimestamps');
    if (stored) {
      setLastReadTimestamps(JSON.parse(stored));
    }
  }, []);

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

  // Ensure all messaged users are in the users list
  useEffect(() => {
    if (!currentUserId) return;
    // Get all userIds from messages (excluding self)
    const messageUserIds = Array.from(new Set(
      messages.flatMap(m => [m.senderId, m.receiverId])
        .filter(id => id !== currentUserId)
    ));
    // For any userId not in users, fetch and add
    messageUserIds.forEach(async (id) => {
      if (!users.find(u => u.id === id) && !fetchedUserIdsRef.current.has(id)) {
        fetchedUserIdsRef.current.add(id);
        try {
          const res = await fetch(`${API_BASE}/users/${id}`);
          if (res.ok) {
            const u = await res.json();
            const newUser = {
              id: u._id,
              name: u.userType === 'Recruiter' ? (u.companyName || 'Unnamed') : (u.name || 'Unnamed'),
              userType: u.userType,
              email: u.email,
              companyName: u.companyName || undefined,
              photoUrl: u.photoUrl || undefined,
            };
            setUsers(prev => [...prev, newUser]);
          }
        } catch (e) { /* ignore */ }
      }
    });
  }, [messages, users, currentUserId]);

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
        setMessages(prev => {
          // Remove all messages for this conversation, then add the fetched ones
          const filtered = prev.filter(m => !(
            (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
            (m.senderId === selectedUserId && m.receiverId === currentUserId)
          ));
          // Deduplicate: Remove temp messages that match a real message
          const dedupedHistory: Message[] = [];
          history.forEach(realMsg => {
            // Remove any temp message that matches this real message
            const tempIndex = filtered.findIndex(tempMsg =>
              tempMsg.id.startsWith('temp_') &&
              tempMsg.content === realMsg.content &&
              tempMsg.senderId === realMsg.senderId &&
              tempMsg.receiverId === realMsg.receiverId &&
              Math.abs(new Date(tempMsg.timestamp).getTime() - new Date(realMsg.timestamp).getTime()) < 10000
            );
            if (tempIndex !== -1) {
              filtered.splice(tempIndex, 1);
            }
            // Only add if not already present by content, sender, receiver, timestamp (within 10s)
            const isDuplicate = dedupedHistory.some(m =>
              m.content === realMsg.content &&
              m.senderId === realMsg.senderId &&
              m.receiverId === realMsg.receiverId &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(realMsg.timestamp).getTime()) < 10000
            );
            if (!isDuplicate) {
              dedupedHistory.push(realMsg);
            }
          });
          return [...filtered, ...dedupedHistory];
        });
      })
      .catch(console.error);
  }, [selectedUserId, currentUserId]);

  // Track lastReadTimestamps per user
  useEffect(() => {
    const stored = localStorage.getItem('lastReadTimestamps');
    if (stored) {
      setLastReadTimestamps(JSON.parse(stored));
    }
  }, []);

  // When a conversation is selected, update lastReadTimestamps in both state and localStorage
  useEffect(() => {
    if (selectedUserId && currentUserId) {
      const updated = { ...lastReadTimestamps, [selectedUserId]: new Date().toISOString() };
      setLastReadTimestamps(updated);
      localStorage.setItem('lastReadTimestamps', JSON.stringify(updated));
    }
  }, [selectedUserId, currentUserId]);

  // Fix: Mark as read after users and selectedUserId are set (not just on mount)
  useEffect(() => {
    if (
      selectedUserId &&
      currentUserId &&
      users.length > 0 &&
      !didInitialRead.current
    ) {
      setLastReadTimestamps(prev => ({ ...prev, [selectedUserId]: new Date().toISOString() }));
      didInitialRead.current = true;
    }
  }, [selectedUserId, currentUserId, users]);

  // When lastReadTimestamps changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('lastReadTimestamps', JSON.stringify(lastReadTimestamps));
  }, [lastReadTimestamps]);

  // Cleanup effect: update lastReadTimestamps for selected chat on unmount
  useEffect(() => {
    return () => {
      if (selectedUserId && currentUserId) {
        const updatedTimestamps = { ...lastReadTimestamps, [selectedUserId]: new Date().toISOString() };
        localStorage.setItem('lastReadTimestamps', JSON.stringify(updatedTimestamps));
      }
    };
  }, [selectedUserId, currentUserId, lastReadTimestamps]);

  // Socket setup
  useEffect(() => {
    if (!currentUserId) return;
    initiateSocket(currentUserId);
    const socket = getSocket();
    if (!socket) return;
    socket.on('receive_message', async (data: any) => {
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
      // If sender is not in users, fetch and add them
      if (data.from !== currentUserId && !users.find(u => u.id === data.from)) {
        try {
          const res = await fetch(`${API_BASE}/users/${data.from}`);
          if (res.ok) {
            const u = await res.json();
            const newUser = {
              id: u._id,
              name: u.userType === 'Recruiter' ? (u.companyName || 'Unnamed') : (u.name || 'Unnamed'),
              userType: u.userType,
              email: u.email,
              companyName: u.companyName || undefined,
              photoUrl: u.photoUrl || undefined,
            };
            setUsers(prev => [...prev, newUser]);
          }
        } catch (e) { /* ignore */ }
      }
      setMessages(prev => {
        // Deduplicate: Only add if not already present by content, sender, receiver, timestamp (within 10s)
        const isDuplicate = prev.some(m =>
          m.content === incoming.content &&
          m.senderId === incoming.senderId &&
          m.receiverId === incoming.receiverId &&
          Math.abs(new Date(m.timestamp).getTime() - new Date(incoming.timestamp).getTime()) < 10000
        );
        if (isDuplicate) return prev;
        // Replace temp message if present
        const tempIndex = prev.findIndex(m =>
          m.id.startsWith('temp_') &&
          m.content === incoming.content &&
          m.senderId === incoming.senderId &&
          m.receiverId === incoming.receiverId &&
          Math.abs(new Date(m.timestamp).getTime() - new Date(incoming.timestamp).getTime()) < 10000
        );
        if (tempIndex !== -1) {
          return prev.map((m, i) => i === tempIndex ? incoming : m);
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

  // New: Store latest messages for chat list sorting
  useEffect(() => {
    if (!currentUserId) return;
    fetch(`${API_BASE}/messages/latest?user1=${currentUserId}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const latest: Message[] = data.map(m => ({
          id: m._id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          content: m.content || '',
          fileUrl: m.fileUrl,
          fileType: m.fileType,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        setLatestMessages(latest);
      })
      .catch(console.error);
  }, [currentUserId]);

  // Ensure all users from latestMessages are present in users array
  useEffect(() => {
    if (!currentUserId) return;
    const userIdsInMessages = Array.from(new Set(
      latestMessages.flatMap(m => [m.senderId, m.receiverId])
        .filter(id => id !== currentUserId)
    ));
    userIdsInMessages.forEach(async (id) => {
      if (!users.find(u => u.id === id) && !fetchedUserIdsRef.current.has(id)) {
        fetchedUserIdsRef.current.add(id);
        try {
          const res = await fetch(`${API_BASE}/users/${id}`);
          if (res.ok) {
            const u = await res.json();
            const newUser = {
              id: u._id,
              name: u.userType === 'Recruiter' ? (u.companyName || 'Unnamed') : (u.name || 'Unnamed'),
              userType: u.userType,
              email: u.email,
              companyName: u.companyName || undefined,
              photoUrl: u.photoUrl || undefined,
            };
            setUsers(prev => [...prev, newUser]);
          }
        } catch (e) { /* ignore */ }
      }
    });
  }, [latestMessages, users, currentUserId]);

  // Helper to refresh latest messages for chat list
  const refreshLatestMessages = () => {
    if (!currentUserId) return;
    fetch(`${API_BASE}/messages/latest?user1=${currentUserId}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const latest: Message[] = data.map(m => ({
          id: m._id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          content: m.content || '',
          fileUrl: m.fileUrl,
          fileType: m.fileType,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        setLatestMessages(latest);
      })
      .catch(console.error);
  };

  // On mount, always refresh latest messages for chat list sorting
  useEffect(() => {
    refreshLatestMessages();
    // Optionally, also refresh users if needed
  }, []);

  // Helper to upsert the latest message for a conversation in latestMessages and force re-render
  function upsertLatestMessage(newMsg: Message) {
    setLatestMessages(prev => {
      const newKey = [newMsg.senderId, newMsg.receiverId].sort().join('-');
      let replaced = false;
      const updated = prev.map(m => {
        const key = [m.senderId, m.receiverId].sort().join('-');
        if (key === newKey) {
          if (new Date(newMsg.timestamp).getTime() > new Date(m.timestamp).getTime()) {
            replaced = true;
            return newMsg;
          }
          replaced = true;
          return m;
        }
        return m;
      });
      if (!replaced) {
        return [newMsg, ...updated];
      }
      return updated;
    });
    // Force re-render
    forceRerender(n => n + 1);
  }

  // After sending a message, optimistically upsert latestMessages
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
      setMessages(prev => [...prev, tempMessage]);
      upsertLatestMessage(tempMessage);
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
      socket.emit('send_message', {
        to: selectedUserId,
        from: currentUserId,
        message: text,
        fileUrl: file?.url,
        fileType: file?.type,
        userType: users.find(u => u.id === currentUserId)?.userType || localStorage.getItem('userType') || '',
      });
      refreshLatestMessages();
    } catch (err) {
      showToastMessage('Failed to send message. Please try again.');
    }
  };

  // After receiving a message, update latestMessages and unreadCounts in real time (no backend delay)
  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();
    if (!socket) return;
    const handler = (data: any) => {
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
      upsertLatestMessage(incoming);
    };
    socket.on('receive_message', handler);
    return () => {
      socket.off('receive_message', handler);
    };
  }, [currentUserId, selectedUserId]);

  // Filter current conversation and sort by timestamp
  const conversationMessages = messages
    .filter(
      m =>
        (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
        (m.senderId === selectedUserId && m.receiverId === currentUserId),
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // WhatsApp-style chat list: unique users, messaged at top, unmessaged at bottom
  // 1. Build a map of userId -> {user, lastMessageTimestamp} for messaged users
  const messagedUserMap = new Map();
  latestMessages.forEach(msg => {
    const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const timestamp = new Date(msg.timestamp).getTime();
    if (!messagedUserMap.has(otherUserId) || timestamp > messagedUserMap.get(otherUserId).lastMessageTimestamp) {
      let user = users.find(u => u.id === otherUserId);
      if (!user) {
        user = { id: otherUserId, name: 'Unknown', userType: '', email: '' };
      }
      messagedUserMap.set(otherUserId, { user, lastMessageTimestamp: timestamp });
    }
  });
  // 2. Messaged users sorted by last message timestamp (desc)
  const messagedUsersSorted = Array.from(messagedUserMap.values())
    .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp)
    .map(entry => entry.user);
  // 3. Unmessaged users (not in messagedUserMap), sorted alphabetically
  const unmessagedUsersSorted = users
    .filter(u => u.id !== currentUserId && !messagedUserMap.has(u.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  // 4. Final chat list: messaged users at top, unmessaged at bottom, no duplicates
  // Memoize finalSortedUsers to avoid infinite update loop
  const finalSortedUsers = useMemo(() => {
    return [...messagedUsersSorted, ...unmessagedUsersSorted];
  }, [messagedUsersSorted, unmessagedUsersSorted]);

  const unreadCounts = useMemo(() => {
    if (!currentUserId) return {};
    const newUnreadCounts: { [userId: string]: number } = {};
    finalSortedUsers.forEach(user => {
      const lastRead = lastReadTimestamps[user.id];
      const unread = messages.filter(m =>
        m.senderId === user.id &&
        m.receiverId === currentUserId &&
        (!lastRead || new Date(m.timestamp) > new Date(lastRead))
      ).length;
      newUnreadCounts[user.id] = user.id === selectedUserId ? 0 : unread;
    });
    return newUnreadCounts;
  }, [messages, currentUserId, selectedUserId, lastReadTimestamps, finalSortedUsers]);

  const selectedUser = users.find(u => u.id === selectedUserId);

  // Handle conversation selection and update lastReadTimestamps immediately
  const handleConversationSelect = (userId: string) => {
    setSelectedUserId(userId);
    // Update lastReadTimestamps in both state and localStorage immediately
    const updated = { ...lastReadTimestamps, [userId]: new Date().toISOString() };
    setLastReadTimestamps(updated);
    localStorage.setItem('lastReadTimestamps', JSON.stringify(updated));
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      
      // Don't try to delete temporary messages (they don't exist in the database)
      if (id.startsWith('temp_') || id.startsWith('m')) {
        setMessages(prev => prev.filter(m => m.id !== id));
        showToastMessage('Message deleted');
        return;
      }

      const res = await fetch(`${API_BASE}/messages/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Delete error response:', errorData);
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to delete message`);
      }
      
      const responseData = await res.json().catch(() => ({}));
      
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
          users={finalSortedUsers}
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
          latestMessages={latestMessages}
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