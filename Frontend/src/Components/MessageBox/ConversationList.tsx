import React, { useEffect } from 'react';
import './MessageBox.css';
import { FaSearch, FaPlus } from 'react-icons/fa';

type User = { id: string; name: string; userType: string; companyName?: string; photoUrl?: string };

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
};

type Props = {
  users: User[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  addUser?: (user: User) => void;
  unreadCounts?: { [userId: string]: number };
  messages?: Message[];
  latestMessages?: Message[];
  currentUserId?: string;
};

const ConversationList: React.FC<Props> = ({ 
  users, 
  selectedUserId, 
  setSelectedUserId, 
  addUser, 
  unreadCounts = {},
  messages = [],
  latestMessages = [],
  currentUserId
}) => {
  const [search, setSearch] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<User[]>([]);
  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

  // Remove internal sorting/filtering: use users prop as-is, only filter for search
  const filtered = users.filter((u) => {
    if (u.id === currentUserId) return false; // Exclude current user
    // Filter out users with missing names/company names
    if (u.userType === 'Recruiter') {
      if (!u.companyName || u.companyName.trim() === '' || u.companyName === 'Unnamed') {
        return false;
      }
    } else {
      if (!u.name || u.name.trim() === '' || u.name === 'Unnamed') {
        return false;
      }
    }
    return u.name.toLowerCase().includes(search.toLowerCase());
  });
  // Use filtered for rendering, preserving order from users prop

  // Helper to get user name by id
  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return 'Unknown';
    if (user.userType === 'Recruiter' && user.companyName) return user.companyName;
    return user.name;
  };

  // Use latestMessages for preview and 'No messages yet'
  const getLastMessage = (userId: string) => {
    if (!currentUserId) return '';
    // Only consider messages where the current user is a participant
    const relevantMessages = latestMessages.filter(
      m => (m.senderId === currentUserId || m.receiverId === currentUserId)
    );
    // Find all messages between current user and this user from relevantMessages
    const conversationMessages = relevantMessages.filter(
      m => (m.senderId === currentUserId && m.receiverId === userId) ||
           (m.senderId === userId && m.receiverId === currentUserId)
    );
    if (conversationMessages.length === 0) {
      return 'No messages yet';
    }
    // Get the message with the latest timestamp
    const lastMessage = conversationMessages.reduce((latest, msg) => {
      return new Date(msg.timestamp).getTime() > new Date(latest.timestamp).getTime() ? msg : latest;
    }, conversationMessages[0]);
    // If last message is from the other user and is unread, prefix with sender's name
    const lastRead = unreadCounts[userId] > 0 && lastMessage.senderId === userId;
    if (lastRead) {
      return `${users.find(u => u.id === userId)?.name || 'Unknown'}: ${lastMessage.content || 'No message content'}`;
    }
    return lastMessage.content || 'No message content';
  };

  // Get time ago
  const getTimeAgo = (userId: string) => {
    if (!currentUserId) return '';
    
    // Find the last message between current user and this user
    const conversationMessages = messages.filter(
      m => (m.senderId === currentUserId && m.receiverId === userId) ||
           (m.senderId === userId && m.receiverId === currentUserId)
    );
    
    if (conversationMessages.length === 0) return '';
    
    // Get the most recent message
    const lastMessage = conversationMessages.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
    const messageTime = new Date(lastMessage.timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="conversation-list">
      <div className="chat-header">
        <h3>Recent Chats</h3>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search name"
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              if (val.length > 0) {
                // fetch suggestions
                fetch(`${API_BASE}/users?search=${encodeURIComponent(val)}`)
                  .then(r=>r.json())
                  .then((data:any[])=>{
                    const mapped:User[] = data.map(u=>({
                      id:u._id,
                      name:u.userType === 'Recruiter' ? (u.companyName || 'Unnamed') : (u.name || 'Unnamed'),
                      userType:u.userType,
                      companyName: u.companyName || undefined,
                      photoUrl: u.photoUrl || undefined
                    }));
                    
                    // Filter out users with missing names/company names
                    const validSuggestions = mapped.filter(u => {
                      if (u.id === currentUserId) return false; // Exclude current user
                      if (u.userType === 'Recruiter') {
                        return u.companyName && u.companyName.trim() !== '' && u.companyName !== 'Unnamed';
                      } else {
                        return u.name && u.name.trim() !== '' && u.name !== 'Unnamed';
                      }
                    });
        
                    setSuggestions(validSuggestions);
                  });
              } else {
                setSuggestions([]);
              }
            }}
          />
        </div>
        {/* Top avatars row - would show most recent contacts */}
        <div className="top-avatars">
          {filtered.slice(0, 5).map((user) => {
            const displayName = user.userType === 'Recruiter' && user.companyName ? user.companyName : user.name;
            const initials = displayName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
            const unreadCount = unreadCounts[user.id] || 0;
            return (
              <div key={user.id} className="top-avatar" onClick={() => setSelectedUserId(user.id)}>
                <div className="avatar-circle" style={{ position: 'relative' }}>
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={displayName} 
                      className="contact-photo"
                    />
                  ) : (
                    initials
                  )}
                  {unreadCount > 0 && (
                    <div className="unread-badge" style={{ position: 'absolute', top: -6, right: -6, background: '#25D366', color: '#fff' }}>{unreadCount}</div>
                  )}
                </div>
                <div style={{ fontSize: 12, marginTop: 2, textAlign: 'center', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="contact-list">
        {filtered.map((user) => {
          const displayName = user.userType === 'Recruiter' && user.companyName ? user.companyName : user.name;
          const initials = displayName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
          const unreadCount = unreadCounts[user.id] || 0;
          return (
            <div
              key={user.id}
              className={`contact-item${user.id === selectedUserId ? ' selected' : ''}`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <div className="contact-avatar">
                <div className="avatar-circle">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={displayName} className="contact-photo" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{displayName}</span>
                  {unreadCount > 0 && user.id !== selectedUserId && (
                    <span className="unread-badge" style={{ background: '#25D366', color: '#fff', marginLeft: 8, minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 600, fontSize: 13 }}>{unreadCount}</span>
                  )}
                </div>
                <div className="contact-preview">{getLastMessage(user.id)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
