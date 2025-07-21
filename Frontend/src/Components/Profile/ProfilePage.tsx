import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import styles from './ProfilePage.module.css';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaIdBadge, FaBirthdayCake, FaInfoCircle, FaCamera, FaChevronRight, FaMapMarkerAlt, FaStethoscope, FaGraduationCap, FaUniversity, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


interface Profile {
  name?: string;
  age?: number;
  bio?: string;
  photoUrl?: string;
  email: string;
  userType: string;
  [key: string]: any;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User';

const ICONS: Record<string, React.ReactNode> = {
  name: <FaUser className={styles.inputIcon} />,
  email: <FaEnvelope className={styles.inputIcon} />,
  userType: <FaIdBadge className={styles.inputIcon} />,
  age: <FaBirthdayCake className={styles.inputIcon} />,
  bio: <FaInfoCircle className={styles.inputIcon} />,
};

const InfoBox: React.FC<{ label: string; value: any; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className={styles.infoBox}>
    <div className={styles.infoLeft}>
      <span className={styles.infoIcon}>{icon}</span>
      <div>
        <div className={styles.infoLabel}>{label}</div>
        <div className={styles.infoValue}>{value}</div>
      </div>
    </div>
    <FaChevronRight className={styles.infoArrow} />
  </div>
);

// Add a Switch component
const Switch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <label className={styles.switch}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className={styles.slider}></span>
  </label>
);

const DELETE_REASONS = [
  'I have privacy concerns',
  'I have a duplicate account',
  'I no longer need this service',
  'I’m not satisfied with the platform',
  'Other',
];

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<Profile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId') || ''; // saved at login

  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId,
        },
      });
      const data = await res.json();
      setProfile(data);
      setFormState({ name: data.name, age: data.age, bio: data.bio });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file (JPG, PNG, etc.)', {
        duration: 3000,
      });
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast('File size must be less than 5MB', {
        duration: 3000,
      });
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    toast('Photo selected! Click Save to upload.', {
      duration: 2000,
    });
  };

  // Drag and drop avatar upload
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const NON_EDITABLE = ['_id', 'email', 'userType', '__v', 'photoUrl', 'password'];



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, val]) => {
        if (val !== undefined) formData.append(key, String(val));
      });
      if (selectedFile) formData.append('photo', selectedFile);

      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId,
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await res.json();
      
      // Always fetch the latest profile after save to ensure all fields are up-to-date
      await fetchProfile();
      setEditing(false);
      setSelectedFile(null);
      
      // Show success message with photo upload confirmation
      if (data.photoUploaded) {
        toast('Profile and photo updated successfully!', {
          duration: 3000,
        });
      } else {
        toast('Profile updated successfully!', {
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast(err instanceof Error ? err.message : 'Failed to update profile', {
        duration: 3000,
      });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const reasonToSend = deleteReason === 'Other' ? customReason : deleteReason;
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': userId,
        },
        body: JSON.stringify({ reason: reasonToSend }),
      });
      if (res.ok) {
        localStorage.clear();
        setShowDeleteModal(false);
        navigate('/login');
      } else {
        toast('Failed to delete account.', {
          duration: 3000,
        });
      }
    } catch (err) {
      toast('Failed to delete account.', {
        duration: 3000,
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!profile) return (
    <div className={styles.profileRoot}>
      <div className={styles.spinner}></div>
    </div>
  );

  const avatar = selectedFile
    ? URL.createObjectURL(selectedFile)
    : profile.photoUrl
      ? profile.photoUrl // Cloudinary URLs are already complete
      : DEFAULT_AVATAR;

  return (
    <div className={styles.profileRoot}>
      {/* Banner/Cover */}
      <div className={styles.banner}></div>
      <div className={styles.profileCard}>
        {/* Avatar Section */}
        <div
          className={styles.avatarSection}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <img
            src={avatar}
            alt="Avatar"
            className={styles.avatarImg + (dragActive ? ' ' + styles.avatarDrag : '')}
            style={{ boxShadow: '0 4px 24px rgba(24,67,137,0.18)' }}
          />
          {editing && (
            <button
              className={styles.avatarEditBtn}
              type="button"
              title="Change photo"
              onClick={() => document.getElementById('profile-photo-input')?.click()}
            >
              <FaCamera />
            </button>
          )}
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div style={{ marginTop: '2.2rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>{profile.name || '-'}</div>
            <div style={{ opacity: 0.8 }}>{profile.email}</div>
            <span className={styles.roleBadge}>{profile.userType}</span>
            {/* Details list */}
          <ul style={{ listStyle: 'none', marginTop: '1.8rem', padding: 0, lineHeight: 1.9, fontSize: '0.96rem' }}>
            {profile.location && <li>📍 {profile.location}</li>}
            {profile.specialty && <li>🏥 {profile.specialty}</li>}
            {(profile as any).higherEducation && <li>🎓 Higher Education</li>}
          </ul>
        </div>
         {/* End inner content */}
         {/* Small info card */}
        <div className={styles.smallCard} style={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
          <div>🗓️ Created: {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'}</div>
          <div style={{ marginTop: 4 }}>🔄 Updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '-'}</div>
        </div>
        </div>
         {/* End Avatar Section */}

        {/* Main Section */}
        <div className={styles.profileMain}>
          {editing ? (
            <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.detailGrid}>
                {/* Name and Age (not for recruiters) */}
                {profile.userType !== 'Recruiter' && <>
                  <div className={styles.floatingLabel}>
                    <FaUser className={styles.inputIcon} />
                    <input name="name" type="text" placeholder=" " value={formState.name ?? profile.name ?? ''} onChange={handleChange} />
                    <label>Full Name</label>
                  </div>
                  <div className={styles.floatingLabel}>
                    <FaBirthdayCake className={styles.inputIcon} />
                    <input name="age" type="number" placeholder=" " value={formState.age ?? profile.age ?? ''} onChange={handleChange} />
                    <label>Age</label>
                  </div>
                </>}
                {/* Recruiter fields */}
                {profile.userType === 'Recruiter' && <>
                  <div className={styles.floatingLabel}>
                    <FaInfoCircle className={styles.inputIcon} />
                    <input name="companyName" type="text" placeholder=" " value={(formState as any).companyName ?? (profile as any).companyName ?? ''} onChange={handleChange} />
                    <label>Company Name</label>
                  </div>
                  <div className={styles.floatingLabel}>
                    <FaInfoCircle className={styles.inputIcon} />
                    <input name="companyType" type="text" placeholder=" " value={(formState as any).companyType ?? (profile as any).companyType ?? ''} onChange={handleChange} />
                    <label>Company Type</label>
                  </div>
                  <div className={styles.floatingLabel}>
                    <FaInfoCircle className={styles.inputIcon} />
                    <input name="position" type="text" placeholder=" " value={(formState as any).position ?? (profile as any).position ?? ''} onChange={handleChange} />
                    <label>Position</label>
                  </div>
                  <div className={styles.floatingLabel}>
                    <FaInfoCircle className={styles.inputIcon} />
                    <input name="contactNumber" type="text" placeholder=" " value={(formState as any).contactNumber ?? (profile as any).contactNumber ?? ''} onChange={handleChange} />
                    <label>Contact Number</label>
                  </div>
                </>}
                {/* Specialty */}
                {profile.userType !== 'Recruiter' && (
                  <div className={styles.floatingLabel}>
                    <FaInfoCircle className={styles.inputIcon} />
                    <input name="specialty" type="text" placeholder=" " value={(formState as any).specialty ?? (profile as any).specialty ?? ''} onChange={handleChange} />
                    <label>Specialty</label>
                  </div>
                )}
                {/* School */}
                {profile.userType !== 'Recruiter' && (
                  <div className={styles.floatingLabel}>
                    <FaUniversity className={styles.inputIcon} />
                    <input name="school" type="text" placeholder=" " value={(formState as any).school ?? (profile as any).school ?? ''} onChange={handleChange} />
                    <label>School</label>
                  </div>
                )}
                {/* Location */}
                <div className={styles.floatingLabel}>
                  <FaInfoCircle className={styles.inputIcon} />
                  <input name="location" type="text" placeholder=" " value={(formState as any).location ?? (profile as any).location ?? ''} onChange={handleChange} />
                  <label>Location</label>
                </div>
                {/* Higher Education toggle as switch (not for recruiters) */}
                {profile.userType !== 'Recruiter' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#5a6a8e' }}>Higher Education Interest</span>
                    <Switch
                      checked={(formState as any).higherEducation === 'yes' || ((formState as any).higherEducation === undefined && (profile as any).higherEducation === 'yes')}
                      onChange={v => setFormState(prev => ({ ...prev, higherEducation: v ? 'yes' : 'no' }))}
                    />
                    <span style={{ color: (formState as any).higherEducation === 'yes' || ((formState as any).higherEducation === undefined && (profile as any).higherEducation === 'yes') ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                      {(formState as any).higherEducation === 'yes' || ((formState as any).higherEducation === undefined && (profile as any).higherEducation === 'yes') ? 'On' : 'Off'}
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.sectionDivider}></div>
              <div className={styles.floatingLabel}>
                <FaInfoCircle className={styles.inputIcon} />
                <textarea name="bio" rows={4} maxLength={500} placeholder=" " value={formState.bio ?? profile.bio ?? ''} onChange={handleChange} />
                <label>Bio</label>
                <div className={styles.charCount}>{(formState.bio ?? profile.bio ?? '').length}/500 characters</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <button className={styles.saveBtn} type="submit">Save</button>
                <button className={styles.cancelBtn} type="button" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className={styles.detailsContainer}>
              <div className={styles.detailsHeader}>
                <div className={styles.profileTitle}>Profile Details</div>
                <button className={styles.editBtn} title="Edit Profile" onClick={() => setEditing(true)}>Edit Profile</button>
              </div>
              <div className={styles.detailGrid}>
                {/* Name and Age (not for recruiters) */}
                {profile.userType !== 'Recruiter' && <InfoBox label="Name" value={profile.name || '-'} icon={<FaUser />} />}
                {profile.userType !== 'Recruiter' && <InfoBox label="Age" value={profile.age || '-'} icon={<FaBirthdayCake />} />}
                <InfoBox label="Email" value={profile.email} icon={<FaEnvelope />} />
                {/* No userType for recruiter */}
                {profile.userType !== 'Recruiter' && <InfoBox label="User Type" value={profile.userType} icon={<FaIdBadge />} />}
                <InfoBox label="Bio" value={profile.bio || '-'} icon={<FaInfoCircle />} />
                {/* Recruiter fields */}
                {profile.userType === 'Recruiter' && <>
                  <InfoBox label="Company Name" value={(profile as any).companyName || '-'} icon={<FaInfoCircle />} />
                  <InfoBox label="Company Type" value={(profile as any).companyType || '-'} icon={<FaInfoCircle />} />
                  <InfoBox label="Position" value={(profile as any).position || '-'} icon={<FaInfoCircle />} />
                  <InfoBox label="Contact Number" value={(profile as any).contactNumber || '-'} icon={<FaInfoCircle />} />
                </>}
              </div>
              <div className={styles.sectionDivider}></div>
              <div className={styles.sectionSubTitle}>Professional Information</div>
              <div className={styles.detailGrid}>
                {/* Only show for non-recruiters */}
                {profile.userType !== 'Recruiter' && <InfoBox label="Specialty" value={(profile as any).specialty || '-'} icon={<FaStethoscope />} />}
                {profile.userType !== 'Recruiter' && <InfoBox label="School" value={(profile as any).school || '-'} icon={<FaUniversity />} />}
                {profile.userType !== 'Recruiter' && (
                  <InfoBox
                    label="Higher Education Interest"
                    value={
                      (profile as any).higherEducation === 'yes' ? (
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>Yes</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>No</span>
                      )
                    }
                    icon={<FaGraduationCap />}
                  />
                )}
                <InfoBox label="Location" value={(profile as any).location || '-'} icon={<FaMapMarkerAlt />} />
              </div>
              <div className={styles.sectionDivider}></div>
              <div className={styles.sectionSubTitle}>Account Information</div>
              <div className={styles.detailGrid}>
                <InfoBox label="Created" value={profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'} icon={<FaClock />} />
                <InfoBox label="Last Updated" value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '-'} icon={<FaClock />} />
              </div>
              <button
                className={styles.deleteAccountBtn}
                style={{ background: '#ef4444', color: '#fff', marginTop: 24, width: '100%' }}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: 420, padding: 32, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <FaExclamationTriangle style={{ color: '#ef4444', fontSize: 32, marginRight: 12 }} />
              <h2 style={{ margin: 0, color: '#ef4444' }}>Delete Account</h2>
            </div>
            <p style={{ color: '#444', marginBottom: 18 }}>Are you sure you want to delete your account? <b>This action cannot be undone.</b></p>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Please tell us why you’re leaving:</div>
              {DELETE_REASONS.map((reason) => (
                <label key={reason} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="delete-reason"
                    value={reason}
                    checked={deleteReason === reason}
                    onChange={() => setDeleteReason(reason)}
                    style={{ marginRight: 8 }}
                  />
                  {reason}
                </label>
              ))}
              {deleteReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify your reason"
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  maxLength={200}
                />
              )}
            </div>
            {(!deleteReason || (deleteReason === 'Other' && !customReason.trim())) && (
              <div style={{ color: '#ef4444', marginBottom: 10, fontSize: 14 }}>Please select or enter a reason to continue.</div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteModal(false)} disabled={deleting} style={{ padding: '8px 18px', borderRadius: 6 }}>Cancel</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deleteReason || (deleteReason === 'Other' && !customReason.trim())}
                style={{ background: '#ef4444', color: '#fff', padding: '8px 18px', borderRadius: 6, fontWeight: 600 }}
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
