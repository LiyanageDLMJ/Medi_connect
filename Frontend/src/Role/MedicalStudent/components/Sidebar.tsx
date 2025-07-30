import React from 'react';
import { FiHome, FiUser, FiBookOpen, FiMessageSquare, FiBriefcase, FiLogOut, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', to: '/medical_student/dashboard', icon: <FiHome size={20} /> },
  { label: 'Profile', to: '/medical_student/profile', icon: <FiUser size={20} /> },
  { label: 'Higher Education', to: '/medical_student/higher-education', icon: <FiBook size={20} /> },
  { label: 'Resources', to: '/medical_student/resources', icon: <FiBookOpen size={20} /> },
  { label: 'Internships', to: '/medical_student/internships', icon: <FiBriefcase size={20} /> },
  { label: 'Messages', to: '/medical_student/messages', icon: <FiMessageSquare size={20} /> },
];

const Sidebar: React.FC = () => {
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
    <div style={{ width: 250, background: '#fff', minHeight: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,0.03)', position: 'relative' }}>
      <div style={{ fontWeight: 700, fontSize: 24, color: '#184389', padding: '2rem 1rem 1rem 1rem', letterSpacing: 1 }}>
        MedConnect
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '1rem' }}>
        {navLinks.map(({ label, to, icon }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: 'none', background: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 16, color: '#374151',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e0f2fe')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {/* Logout Button - absolutely positioned at the bottom */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: 'none', background: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 16, color: '#b91c1c',
          transition: 'background 0.2s',
          position: 'absolute', bottom: 24, left: 16, right: 16, width: 'calc(100% - 32px)'
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#fee2e2')}
        onMouseOut={e => (e.currentTarget.style.background = 'none')}
      >
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
