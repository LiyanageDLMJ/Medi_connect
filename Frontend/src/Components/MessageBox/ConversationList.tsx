import React from 'react';
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
  currentUserId?: string;
};

const ConversationList: React.FC<Props> = ({ 
  users, 
  selectedUserId, 
  setSelectedUserId, 
  addUser, 
  unreadCounts = {},
  messages = [],
  currentUserId
}) => {
  const [search, setSearch] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<User[]>([]);
  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

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

  // Sort conversations by most recent message
  const sortedConversations = filtered.sort((a, b) => {
    if (!currentUserId) return 0;
    
    // Get the most recent message for each user
    const getLastMessageTime = (userId: string) => {
      const conversationMessages = messages.filter(
        m => (m.senderId === currentUserId && m.receiverId === userId) ||
             (m.senderId === userId && m.receiverId === currentUserId)
      );
      
      if (conversationMessages.length === 0) return new Date(0); // No messages = oldest
      
      const lastMessage = conversationMessages.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      return new Date(lastMessage.timestamp);
    };
    
    const aLastMessageTime = getLastMessageTime(a.id);
    const bLastMessageTime = getLastMessageTime(b.id);
    
    // Sort by most recent first (descending order)
    return bLastMessageTime.getTime() - aLastMessageTime.getTime();
  });

  // Get recent messages for preview
  const getLastMessage = (userId: string) => {
    if (!currentUserId) return '';
    
    // Find the last message between current user and this user
    const conversationMessages = messages.filter(
      m => (m.senderId === currentUserId && m.receiverId === userId) ||
           (m.senderId === userId && m.receiverId === currentUserId)
    );
    
    if (conversationMessages.length === 0) return 'No messages yet';
    
    // Get the most recent message
    const lastMessage = conversationMessages.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
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
          {sortedConversations.slice(0, 5).map((user) => {
            const displayName = user.userType === 'Recruiter' && user.companyName ? user.companyName : user.name;
            const initials = displayName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
            return (
              <div key={user.id} className="top-avatar" onClick={() => setSelectedUserId(user.id)}>
                <div className="avatar-circle">
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={displayName} 
                      className="contact-photo"
                    />
                  ) : (
                    initials
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                addUser && addUser(s);
                setSelectedUserId(s.id);
                setSearch('');
                setSuggestions([]);
              }}
            >
              {s.name} <span style={{ color: '#888' }}>({s.userType})</span>
            </li>
          ))}
        </ul>
      )}

      <div className="contact-list">
        {sortedConversations.map((user) => {
          const displayName = user.userType === 'Recruiter' && user.companyName ? user.companyName : user.name;
          const initials = displayName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
          const isSelected = user.id === selectedUserId;
          const unreadCount = unreadCounts[user.id] || 0;
          
          return (
            <div
              key={user.id}
              className={`contact-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <div className="contact-avatar">
                <div className="avatar-circle">
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={displayName} 
                      className="contact-photo"
                    />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              
              <div className="contact-info">
                <div className="contact-name">
                  {displayName}
                  {unreadCount > 0 && (
                    <div className="unread-badge">{unreadCount}</div>
                  )}
                </div>
                <div className="contact-preview">{getLastMessage(user.id)}</div>
              </div>
              
              <div className="contact-meta">
                <div className="contact-time">{getTimeAgo(user.id)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
