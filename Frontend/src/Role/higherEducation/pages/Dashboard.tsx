import  { useEffect, useState } from 'react';
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64 bg-gray-50">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Welcome, {profile.name || 'Educational Institution'}!</h1>
              <p className="text-gray-600 text-xl mt-2">{profile.userType ? `Role: ${profile.userType}` : 'Manage your programs, connect with students, and post opportunities.'}</p>
            </div>
          </div>
          <div className="bg-yellow-100 rounded-xl p-8 max-w-4xl">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Institution Tools</h2>
            <ul className="text-yellow-700 text-lg space-y-2">
              <li>• Post and manage degree programs</li>
              <li>• Review student applications</li>
              <li>• Communicate with prospective students</li>
              <li>• Track program statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
