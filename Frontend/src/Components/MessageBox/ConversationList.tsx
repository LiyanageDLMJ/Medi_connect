import React from 'react';
import './MessageBox.css';

type User = { id: string; name: string; role: string };

type Props = {
  users: User[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
};

const ConversationList: React.FC<Props> = ({ users, selectedUserId, setSelectedUserId }) => (
  <div className="conversation-list">
    <h3>Conversations</h3>
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          className={user.id === selectedUserId ? 'selected' : ''}
          onClick={() => setSelectedUserId(user.id)}
        >
          {user.name} <span className="role">({user.role})</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ConversationList;
