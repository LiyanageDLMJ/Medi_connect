import React from 'react';
import Sidebar from "../components/Sidebar";
import MessageBox from "../../../Components/MessageBox/MessageBox";

const Messages: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ flex: '0 0 250px', height: '100vh' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
        <MessageBox />
      </div>
    </div>
  );
};

export default Messages;
