import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiBook,
  FiMessageSquare,
  FiCalendar,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
// TODO: Fix import path if socket module is moved or renamed
import { initiateSocket, getSocket } from "../../../Components/MessageBox/socket";

const SidebarNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", to: "/medical_student/dashboard", icon: <FiHome size={20} /> },
    { label: "Your Profile", to: "/medical_student/profile", icon: <FiUser size={20} /> },
    { label: 'CV Insertion', to: '/medical_student/cv-step01', icon: <FiFileText size={20} /> },
    {
      label: "Job & Internships",
      to: "/medical_student/job-internship",
      icon: <FiBriefcase size={20} />,
    },
     {
      label: "Track job Application",
      to: "/medical_student/job-application-tracker",
      icon: <FiSearch size={20} />,
    },
    {
      label: "Higher Education",
      to: "/medical_student/higher-education",
      icon: <FiBook size={20} />,
    },
    {
      label: "Messages",
      to: "/medical_student/messages",
      icon: <FiMessageSquare size={20} />,
    },
    {
      label: "Interview Invitations",
      to: "/medical_student/interview-invitations",
      icon: <FiCalendar size={20} />,
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
                onClick={() => {
                  navigate(to);
                  setIsOpen(false);
                  if (label === 'Messages') setUnread(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-black hover:bg-[#184389] hover:text-white rounded-[12px] transition-all relative"
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

export default SidebarNav;
