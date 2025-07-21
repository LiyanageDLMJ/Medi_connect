import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";

const InstitutionDashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ name?: string; userType?: string }>({});
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
    fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId || '',
      },
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {});
  }, []);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#374151' }}>Welcome, {profile.name || 'Educational Institution'}!</h1>
            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>{profile.userType ? `Role: ${profile.userType}` : 'Manage your programs, connect with students, and post opportunities.'}</p>
          </div>
        </div>
        <div style={{ background: '#fef9c3', borderRadius: 12, padding: 32, maxWidth: 700 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#b45309' }}>Institution Tools</h2>
          <ul style={{ marginTop: 16, color: '#92400e', fontSize: '1.1rem' }}>
            <li>• Post and manage degree programs</li>
            <li>• Review student applications</li>
            <li>• Communicate with prospective students</li>
            <li>• Track program statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
