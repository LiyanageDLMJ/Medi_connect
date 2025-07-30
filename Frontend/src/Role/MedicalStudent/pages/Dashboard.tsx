// import React, { useEffect, useState } from 'react';
// import Sidebar from "../components/Sidebar";

// const MedicalStudentDashboard: React.FC = () => {
//   const [profile, setProfile] = useState<{ name?: string; userType?: string }>({});
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
//     fetch(`${API_BASE}/profile`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'x-user-id': userId || '',
//       },
//     })
//       .then(res => res.json())
//       .then(data => setProfile(data))
//       .catch(() => {});
//   }, []);
//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: '2rem' }}>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
//           <div>
//             <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#374151' }}>Welcome, {profile.name || 'Medical Student'}!</h1>
//             <p style={{ color: '#64748b', fontSize: '1.2rem' }}>{profile.userType ? `Role: ${profile.userType}` : 'Kickstart your career, find internships, and connect with mentors.'}</p>
//           </div>
//         </div>
//         <div style={{ background: '#e0f2fe', borderRadius: 12, padding: 32, maxWidth: 700 }}>
//           <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0369a1' }}>Explore Opportunities</h2>
//           <ul style={{ marginTop: 16, color: '#334155', fontSize: '1.1rem' }}>
//             <li>• Search and apply for higher education degrees</li>
//             <li>• Search and apply for internships and jobs</li>
//             <li>• Access study resources and webinars</li>
//             <li>• Track your application status</li>
//             <li>• Chat with recruiters and mentors</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalStudentDashboard;
