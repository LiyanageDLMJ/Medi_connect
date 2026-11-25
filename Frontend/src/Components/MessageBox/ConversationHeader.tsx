import React from 'react';
import { FaInfoCircle, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import './MessageBox.css';

export type HeaderUser = { id: string; name: string; userType: string; photoUrl?: string } | undefined;

interface Props {
  user?: HeaderUser;
  onProfileClick?: () => void;
  showProfile?: boolean;
  onToggleProfile?: () => void;
  onClearChat?: () => void;
}

const ConversationHeader: React.FC<Props> = ({ user, onProfileClick, showProfile, onToggleProfile, onClearChat }) => {
  if (!user) return <div className="conversation-header" />;

  // derive initials for avatar
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="conversation-header">
      <div className="avatar-large">
        {user.photoUrl ? (
          <img 
            src={user.photoUrl} 
            alt={user.name} 
            className="header-photo"
          />
        ) : (
          initials
        )}
      </div>
      <div className="header-info">
        <div className="name-row">
          <h4>{user.name}</h4>
        </div>
      </div>
      <button className="info-btn" title="Chat info" onClick={onProfileClick}>
        <FaInfoCircle />
      </button>
      {onToggleProfile && (
        <button className="toggle-profile-btn" title="Toggle profile" onClick={onToggleProfile}>
          {showProfile ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
      {onClearChat && (
        <button
          className="clear-chat-btn"
          title="Clear chat"
          onClick={() => {
            if (window.confirm('Clear all messages in this chat?')) onClearChat();
          }}
          style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default ConversationHeader;
