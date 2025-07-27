import  { useEffect, useState } from 'react';
import NavBar from "../components/NavBar/Sidebar";
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdBadge, FaBirthdayCake, FaInfoCircle, FaMapMarkerAlt, FaStethoscope, FaGraduationCap, FaUniversity, FaClock, FaEdit, FaCamera } from 'react-icons/fa';

interface Profile {
  name?: string;
  age?: number;
  bio?: string;
  photoUrl?: string;
  email: string;
  userType: string;
  profession?: string;
  specialty?: string;
  location?: string;
  school?: string;
  [key: string]: any;
}

const YourProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
        
        const res = await fetch(`${API_BASE}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId || '',
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)' }}>
        <NavBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)' }}>
        <NavBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)' }}>
      <NavBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '2.5rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 800, marginTop: 32 }}>
          {/* Header */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(24,67,137,0.08)', padding: '2rem', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#184389', margin: 0 }}>
                Your Profile
              </h1>
              <Link 
                to="/profile/edit" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#2563eb',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                <FaEdit size={16} />
                Edit Profile
              </Link>
            </div>
            
            {/* Profile Photo and Basic Info */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.name || 'User'}&size=120&background=184389&color=fff`}
                  alt={profile.name || 'Profile'}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #e3eafc'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <FaCamera size={16} />
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#184389', marginBottom: 8 }}>
                  {profile.name || 'No Name'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: 16 }}>
                  {profile.userType}
                </p>
                {profile.bio && (
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: 16, 
                    borderRadius: 8, 
                    border: '1px solid #e2e8f0',
                    marginBottom: 16
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <FaInfoCircle style={{ color: '#64748b' }} />
                      <span style={{ fontWeight: 600, color: '#374151' }}>Bio</span>
                    </div>
                    <p style={{ color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(24,67,137,0.08)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#184389', marginBottom: 24 }}>
              Profile Details
            </h3>
            
            <div style={{ display: 'grid', gap: 20 }}>
              <ProfileField icon={<FaUser />} label="Name" value={profile.name || 'Not provided'} />
              <ProfileField icon={<FaEnvelope />} label="Email" value={profile.email} />
              <ProfileField icon={<FaBirthdayCake />} label="Age" value={profile.age ? `${profile.age} years` : 'Not provided'} />
              <ProfileField icon={<FaIdBadge />} label="User Type" value={profile.userType} />
              <ProfileField icon={<FaInfoCircle />} label="Bio" value={profile.bio || 'Not provided'} />
              <ProfileField icon={<FaMapMarkerAlt />} label="Location" value={profile.location || 'Not provided'} />
              
              {profile.profession && (
                <ProfileField icon={<FaStethoscope />} label="Profession" value={profile.profession} />
              )}
              
              {profile.specialty && (
                <ProfileField icon={<FaGraduationCap />} label="Specialty" value={profile.specialty} />
              )}
              
              {profile.school && (
                <ProfileField icon={<FaUniversity />} label="School/Institute" value={profile.school} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 16, 
    padding: 16, 
    background: '#f8fafc', 
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: 40,
      height: 40,
      background: '#e3eafc',
      borderRadius: 8,
      color: '#184389'
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem', color: '#374151', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  </div>
);

export default YourProfile;
