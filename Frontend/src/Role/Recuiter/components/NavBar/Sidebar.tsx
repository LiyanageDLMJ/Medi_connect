import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiUser, FiMessageSquare, FiBook, FiBarChart2, FiSettings, FiLogOut, FiFileText, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { initiateSocket, getSocket } from '../../../../Components/MessageBox/socket';
import { useNotification } from '../../../../context/NotificationContext';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetUnreadCount } = useNotification();

  const navLinks = [
    {
      label: "Dashboard",
      to: "/recruiter/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      label: "Your Profile",
      to: "/recruiter/profile",
      icon: <FiUser size={20} />,
    },
    {
      label: "Job Post",
      to: "/recruiter/jobPost",
      icon: <FiFileText size={20} />,
    },
    {
      label: "Job Listing",
      to: "/recruiter/JobListing",
      icon: <FiBriefcase size={20} />,
    },
    {
      label: "View Candidates",
      to: "/recruiter/ViewCandidates",
      icon: <FiBarChart2 size={20} />,
    },
    {
      label: "Messages",
      to: "/recruiter/messages",
      icon: <FiMessageSquare size={20} />,
    },
  ];

  // --- Notification Badge Logic ---
  const [unread, setUnread] = useState(false);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1';
    initiateSocket(userId);
    const socket = getSocket();
    if (!socket) return;
    socket.on('receive_message', () => {
      setUnread(true);
    });
    return () => {
      socket?.off('receive_message');
    };
  }, []);

  const handleNavClick = (to: string, label: string) => {
    navigate(to);
    setIsOpen(false);
    if (label === 'Messages') {
      setUnread(false);
      resetUnreadCount(); // Reset all unread counts when visiting Messages
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-50 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 h-screen bg-white shadow-lg transform transition-transform md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex items-center justify-between p-7">
          <span className="text-xl font-bold">
            <span className="text-blue-600">Medi</span>Connect
          </span>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <FiMenu size={24} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <nav className="flex flex-col px-4 space-y-2" style={{ flex: 1 }}>
            {navLinks.map(({ to, label, icon }) => (
              <button
                key={to}
                onClick={() => handleNavClick(to, label)}
                className={`flex items-center gap-3 px-4 py-2 text-black hover:bg-[#184389] hover:text-white rounded-[12px] transition-all relative ${
                  location.pathname === to ? 'bg-[#184389] text-white' : ''
                }`}
              >
                {icon}
                <span>{label}</span>
                {label === 'Messages' && unread && (
                  <span style={{position:'absolute',right:18,top:12,background:'#e53e3e',borderRadius:'50%',width:12,height:12,display:'inline-block'}}></span>
                )}
              </button>
            ))}
          </nav>
          {/* Logout Button - flush with bottom */}
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-4 py-2 text-black hover:bg-red-100 hover:text-red-600 rounded-[12px] transition-all mb-6 mx-4"
            style={{ width: 'calc(100% - 2rem)' }}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
