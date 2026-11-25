import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaMapMarkerAlt, FaCalendarAlt, FaBan, FaUser, FaEnvelope, FaUniversity, FaStethoscope, FaGraduationCap } from 'react-icons/fa';
import './MessageBox.css';

type User = { id: string; name: string; userType: string; email: string; companyName?: string; photoUrl?: string };

interface UserProfile {
  name?: string;
  age?: number;
  bio?: string;
  photoUrl?: string;
  email: string;
  userType: string;
  location?: string;
  specialty?: string;
  school?: string;
  higherEducation?: string;
  companyName?: string;
  companyType?: string;
  position?: string;
  contactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  user?: User;
  onClose?: () => void;
}

const ProfilePanel: React.FC<Props> = ({ user, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, API_BASE]);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-panel">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt={user.name} 
                className="profile-photo"
              />
            ) : (
              initials
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user.name}</h3>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="profile-photo"
            />
          ) : (
            initials
          )}
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{profile?.name || user.name}</h3>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <FaEnvelope className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">EMAIL</span>
            <span className="detail-value">{profile?.email || user.email}</span>
          </div>
        </div>

        {profile?.location && (
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">LOCATION</span>
              <span className="detail-value">{profile.location}</span>
            </div>
          </div>
        )}

        {/* User Type specific fields */}
        {user.userType !== 'Recruiter' && profile?.age && (
          <div className="detail-item">
            <FaUser className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">AGE</span>
              <span className="detail-value">{profile.age}</span>
            </div>
          </div>
        )}

        {user.userType !== 'Recruiter' && profile?.specialty && (
          <div className="detail-item">
            <FaStethoscope className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">SPECIALTY</span>
              <span className="detail-value">{profile.specialty}</span>
            </div>
          </div>
        )}

        {user.userType !== 'Recruiter' && profile?.school && (
          <div className="detail-item">
            <FaUniversity className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">SCHOOL</span>
              <span className="detail-value">{profile.school}</span>
            </div>
          </div>
        )}

        {user.userType !== 'Recruiter' && profile?.higherEducation && (
          <div className="detail-item">
            <FaGraduationCap className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">HIGHER EDUCATION</span>
              <span className="detail-value">
                {profile.higherEducation === 'yes' ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}

        {/* Recruiter specific fields */}
        {user.userType === 'Recruiter' && profile?.companyName && (
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">COMPANY NAME</span>
              <span className="detail-value">{profile.companyName}</span>
            </div>
          </div>
        )}

        {user.userType === 'Recruiter' && profile?.companyType && (
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">COMPANY TYPE</span>
              <span className="detail-value">{profile.companyType}</span>
            </div>
          </div>
        )}

        {user.userType === 'Recruiter' && profile?.position && (
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">POSITION</span>
              <span className="detail-value">{profile.position}</span>
            </div>
          </div>
        )}

        {user.userType === 'Recruiter' && profile?.contactNumber && (
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">CONTACT NUMBER</span>
              <span className="detail-value">{profile.contactNumber}</span>
            </div>
          </div>
        )}

        {profile?.bio && (
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">BIO</span>
              <span className="detail-value">{profile.bio}</span>
            </div>
          </div>
        )}

        <div className="detail-item">
          <FaInfoCircle className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">ROLE</span>
            <span className="detail-value">{profile?.userType || user.userType}</span>
          </div>
        </div>

        <div className="detail-item">
          <FaCalendarAlt className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">JOINED</span>
            <span className="detail-value">{formatDate(profile?.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions-bottom">
        <button className="block-btn">
          <FaBan />
          BLOCK
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel; 