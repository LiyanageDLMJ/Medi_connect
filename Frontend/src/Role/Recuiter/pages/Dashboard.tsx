import React, { useEffect, useState } from 'react';
import Sidebar from "../components/NavBar/Sidebar";
import { Link } from 'react-router-dom';
import { FaBriefcase, FaList, FaEnvelope, FaUserTie, FaUsers, FaClipboardList } from 'react-icons/fa';

const Dashboard = () => {
  const [profile, setProfile] = useState<{ name?: string; userType?: string; companyName?: string; photoUrl?: string }>({});
  const [stats, setStats] = useState<{ jobs?: number; openJobs?: number; candidates?: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

    // Fetch profile
    fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        console.log('Fetched profile:', data);
      })
      .catch(() => {});

    // Fetch recruiter stats from backend
    fetch(`${API_BASE}/recruiter/stats?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        console.log('Fetched stats:', data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '2.5rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 900, marginTop: 32 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(24,67,137,0.08)', padding: '2.5rem 2rem', marginBottom: 32 }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#184389', marginBottom: 8 }}>
              Welcome, {profile.companyName || profile.name || 'Recruiter'}!
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: 24 }}>
              {profile.userType ? `Role: ${profile.userType}` : 'Manage your job posts, candidates, and messages.'}
            </p>
            {/* Recruiter-specific quick stats */}
            {loading ? (
              <div>Loading stats...</div>
            ) : (
              <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
                <StatCard icon={<FaClipboardList size={28} style={{ color: '#2563eb' }} />} label="Total Job Posts" value={stats.jobs ?? '-'} />
                <StatCard icon={<FaBriefcase size={28} style={{ color: '#16a34a' }} />} label="Open Positions" value={stats.openJobs ?? '-'} />
                <StatCard icon={<FaUsers size={28} style={{ color: '#f59e0b' }} />} label="Candidates" value={stats.candidates ?? '-'} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 12 }}>
              <QuickActionCard to="/recruiter/jobPost" icon={<FaBriefcase size={32} style={{ color: '#2563eb' }} />} label="Post a Job" />
              <QuickActionCard to="/recruiter/jobListing" icon={<FaList size={32} style={{ color: '#16a34a' }} />} label="Job Listings" />
              <QuickActionCard to="/recruiter/messages" icon={<FaEnvelope size={32} style={{ color: '#f59e0b' }} />} label="Messages" />
              <QuickActionCard to="/recruiter/profile" icon={<FaUserTie size={32} style={{ color: '#184389' }} />} label="Your Profile" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div style={{ background: '#f4f7fb', borderRadius: 12, boxShadow: '0 2px 8px rgba(24,67,137,0.06)', padding: '1.2rem 2rem', minWidth: 140, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.1rem', color: '#184389' }}>
    {icon}
    <div style={{ marginTop: 8 }}>{label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb', marginTop: 4 }}>{value}</div>
  </div>
);

const QuickActionCard = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link to={to} style={quickLinkStyle}>
    {icon}
    <span style={{ marginTop: 12 }}>{label}</span>
  </Link>
);

const quickLinkStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f4f7fb',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(24,67,137,0.06)',
  padding: '1.5rem 2rem',
  minWidth: 140,
  minHeight: 120,
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#184389',
  textDecoration: 'none',
  transition: 'background 0.18s, box-shadow 0.18s',
  marginBottom: 12,
};

export default Dashboard;