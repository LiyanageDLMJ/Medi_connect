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
      setFormState({ ...data }); // Use all fields from profile
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update handleChange to accept HTMLSelectElement as well
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleEditProfile = () => {
    if (!profile) return;
    setFormState({
      ...profile,
      higherEducation: profile.higherEducation || profile.higher_education || 'no',
      companyType: profile.companyType ?? (profile as any).companyType ?? '',
      instituteType: profile.instituteType ?? (profile as any).instituteType ?? '',
      yearOfStudy: profile.yearOfStudy ?? profile.year_of_study ?? '',
    });
    setEditing(true);
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

  const normalizedUserType = (profile.userType || '').toLowerCase().replace(/\s/g, '');
  const isDoctor = normalizedUserType === 'doctor';
  const isMedicalStudent = normalizedUserType === 'medicalstudent';
  const isRecruiter = normalizedUserType === 'recruiter';
  const isEducationalInstitute = normalizedUserType === 'educationalinstitute';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Left column: Profile summary */}
      {/* Replace the left column (profile summary card) with a more professional and attractive design */}
      <div style={{
        width: 340,
        background: '#184389', // solid theme color
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3.5rem 1.5rem 2rem 1.5rem',
        minHeight: '100vh',
        // borderRadius: 18, // removed rounded edges
        boxShadow: '0 8px 32px rgba(24,67,137,0.18)',
        position: 'relative',
      }}>
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <img
            src={avatar}
            alt="Avatar"
            style={{
              width: 170, // increased size
              height: 170,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '6px solid #fff',
              boxShadow: '0 6px 24px rgba(24,67,137,0.18)',
              background: '#f8fafc',
            }}
          />
          {editing && (
            <>
              <input
                type="file"
                id="profile-photo-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                className={styles.avatarEditBtn}
                type="button"
                title="Change photo"
                onClick={() => document.getElementById('profile-photo-input')?.click()}
                style={{ position: 'absolute', right: -16, top: 12, background: '#fff', color: '#184389', borderRadius: '50%', border: 'none', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(24,67,137,0.10)' }}
              >
                <FaCamera />
              </button>
            </>
          )}
        </div>
        <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 18, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.2 }}>{profile.name || '-'}</div>
        <div style={{ opacity: 0.95, fontSize: 16, marginBottom: 10, textAlign: 'center', wordBreak: 'break-all' }}>{profile.email}</div>
        <div style={{
          background: 'rgba(37,99,235,0.18)',
          color: '#fff',
          borderRadius: 16,
          padding: '5px 22px',
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 12,
          letterSpacing: 1.2,
          boxShadow: '0 2px 8px rgba(24,67,137,0.10)',
          textTransform: 'capitalize',
        }}>{profile.userType}</div>
        {profile.location && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 16 }}>
            <FaMapMarkerAlt style={{ marginRight: 7, color: '#fff', opacity: 0.8 }} />
            {profile.location}
          </div>
        )}
        {(profile.higherEducation === 'yes' || profile.higher_education === 'yes') && (
          <div style={{
            marginBottom: 12,
            color: '#22c55e',
            fontWeight: 700,
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
          }}>
            <FaGraduationCap style={{ marginRight: 7 }} />
            Higher Education
          </div>
        )}
        <div style={{
          background: '#fff',
          color: '#184389',
          borderRadius: 16,
          padding: '1.1rem 1.2rem',
          marginTop: 'auto',
          marginBottom: 10,
          fontSize: 15,
          boxShadow: '0 2px 10px rgba(24,67,137,0.10)',
          width: '100%',
          textAlign: 'center',
        }}>
          <div><FaClock style={{ marginRight: 6 }} />Created: {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'}</div>
          <div style={{ marginTop: 4 }}><FaClock style={{ marginRight: 6 }} />Updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '-'}</div>
        </div>
      </div>
      {/* Right column: Profile details/edit form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '1.2rem 0.5rem', color: '#1e293b' }}>
        <div style={{ width: '100%', maxWidth: 1200, minHeight: 650, marginTop: 0 }}>
          <div style={{ background: '#fff', padding: 0, marginBottom: 0, minHeight: 200 }}>
            {editing ? (
              <form className={styles.profileForm} onSubmit={handleSubmit}>
                <div style={{
                  background: '#f8fafc',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(24,67,137,0.10)',
                  padding: '1.2rem 1.5rem',
                  maxWidth: 900,
                  margin: '0 auto',
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.3rem 2.2rem', // increased gap for more space
                  alignItems: 'start',
                  minHeight: 350,
                }}>
                  {/* Section: Personal Info */}
                  <div style={{ gridColumn: '1 / span 2', marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Personal Information</div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0, marginBottom: 18 }} />
                  </div>
                  {/* Render user-type-specific fields here, as before (do not change field logic) */}
                  {isDoctor && <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                      <input name="name" type="text" value={formState.name ?? profile.name ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Age</label>
                      <input name="age" type="number" value={formState.age ?? profile.age ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Profession</label>
                      <input name="profession" type="text" value={formState.profession ?? profile.profession ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Specialty</label>
                      <input name="specialty" type="text" value={formState.specialty ?? profile.specialty ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Location</label>
                      <input name="location" type="text" value={formState.location ?? profile.location ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Higher Education Interest</label>
                      <Switch checked={formState.higherEducation === 'yes'} onChange={v => setFormState(prev => ({ ...prev, higherEducation: v ? 'yes' : 'no' }))} />
                    </div>
                  </>}
                  {isMedicalStudent && <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                      <input name="name" type="text" value={formState.name ?? profile.name ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Age</label>
                      <input name="age" type="number" value={formState.age ?? profile.age ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Current Institute</label>
                      <input name="currentInstitute" type="text" value={formState.currentInstitute ?? profile.currentInstitute ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Year of Study</label>
                      <select name="yearOfStudy" value={formState.yearOfStudy ?? profile.yearOfStudy ?? ''} onChange={handleChange} required className={styles.inputCard}>
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                        <option value="5">Fifth Year</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Field of Study</label>
                      <input name="fieldOfStudy" type="text" value={formState.fieldOfStudy ?? profile.fieldOfStudy ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Location</label>
                      <input name="location" type="text" value={formState.location ?? profile.location ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Higher Education Interest</label>
                      <Switch checked={formState.higherEducation === 'yes'} onChange={v => setFormState(prev => ({ ...prev, higherEducation: v ? 'yes' : 'no' }))} />
                    </div>
                  </>}
                  {isRecruiter && <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Company Name</label>
                      <input name="companyName" type="text" value={formState.companyName ?? (profile as any).companyName ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Company Type</label>
                      <select name="companyType" value={(formState.companyType ?? (profile as any).companyType ?? '').toLowerCase()} onChange={handleChange} required className={styles.inputCard}>
                        <option value="">Select Company Type</option>
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="pharmaceutical">Pharmaceutical</option>
                        <option value="medical device">Medical Device</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Position</label>
                      <input name="position" type="text" value={formState.position ?? (profile as any).position ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Contact Number</label>
                      <input name="contactNumber" type="text" value={formState.contactNumber ?? (profile as any).contactNumber ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                  </>}
                  {isEducationalInstitute && <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Institute Name</label>
                      <input name="instituteName" type="text" value={formState.instituteName ?? (profile as any).instituteName ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Institute Type</label>
                      <select name="instituteType" value={formState.instituteType ?? (profile as any).instituteType ?? ''} onChange={handleChange} required className={styles.inputCard}>
                        <option value="">Select Institute Type</option>
                        <option value="Medical College">Medical College</option>
                        <option value="University">University</option>
                        <option value="Nursing School">Nursing School</option>
                        <option value="Research Institute">Research Institute</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Accreditation</label>
                      <input name="accreditation" type="text" value={formState.accreditation ?? (profile as any).accreditation ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontWeight: 600, marginBottom: 6 }}>Established Year</label>
                      <input name="establishedYear" type="text" value={formState.establishedYear ?? (profile as any).establishedYear ?? ''} onChange={handleChange} required className={styles.inputCard} />
                    </div>
                  </>}
                  {/* After user-type-specific fields, add the Bio field for all user types */}
                  <div style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column', marginTop: 2 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6 }}>Bio</label>
                    <textarea
                      name="bio"
                      value={formState.bio ?? profile.bio ?? ''}
                      onChange={handleChange}
                      className={styles.inputCard}
                      rows={2}
                      style={{ resize: 'vertical', minHeight: 40, fontSize: 15 }}
                      maxLength={500}
                      placeholder="Tell us about yourself (max 500 characters)"
                    />
                    <div style={{ alignSelf: 'flex-end', fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {(formState.bio ?? profile.bio ?? '').length}/500
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
                  <button
                    className={styles.editBtn}
                    type="button"
                    style={{ minWidth: 110, background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: 8, fontWeight: 600, padding: '0.6rem 1.2rem', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.editBtn}
                    type="submit"
                    style={{ minWidth: 140, background: '#2563eb', color: '#fff', border: '2px solid #2563eb', borderRadius: 8, fontWeight: 600, padding: '0.6rem 1.2rem', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.detailsContainer}>
                {/* In view mode, remove the Profile Information title and subtitle. */}
                {/* Place the Edit Profile button inline with the 'Profile Details' section header. */}
                {!editing && (
                  <div className={styles.detailsHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div className={styles.profileTitle}>Profile Details</div>
                    <button className={styles.editBtn} title="Edit Profile" onClick={handleEditProfile}>Edit Profile</button>
                  </div>
                )}
                <div className={styles.detailGrid}>
                  {/* Name and Age (only for Doctor and Medical Student) */}
                  {(isDoctor || isMedicalStudent) && <InfoBox label="Name" value={profile.name || '-'} icon={<FaUser />} />}
                  {(isDoctor || isMedicalStudent) && <InfoBox label="Age" value={profile.age || '-'} icon={<FaBirthdayCake />} />}
                  <InfoBox label="Email" value={profile.email} icon={<FaEnvelope />} />
                  {/* User Type (not for recruiter or educational institute) */}
                  {(isDoctor || isMedicalStudent) && <InfoBox label="User Type" value={profile.userType} icon={<FaIdBadge />} />}
                  <InfoBox label="Bio" value={profile.bio || '-'} icon={<FaInfoCircle />} />
                  {/* Recruiter fields */}
                  {isRecruiter && <>
                    <InfoBox label="Company Name" value={(profile as any).companyName || '-'} icon={<FaInfoCircle />} />
                    <InfoBox label="Company Type" value={(profile as any).companyType || '-'} icon={<FaInfoCircle />} />
                    <InfoBox label="Position" value={(profile as any).position || '-'} icon={<FaInfoCircle />} />
                    <InfoBox label="Contact Number" value={(profile as any).contactNumber || '-'} icon={<FaInfoCircle />} />
                  </>}
                  {/* Educational Institute fields */}
                  {isEducationalInstitute && <>
                    <InfoBox label="Institute Name" value={(profile as any).instituteName || '-'} icon={<FaUniversity />} />
                    <InfoBox label="Institute Type" value={(profile as any).instituteType || '-'} icon={<FaInfoCircle />} />
                    <InfoBox label="Accreditation" value={(profile as any).accreditation || '-'} icon={<FaInfoCircle />} />
                    <InfoBox label="Established Year" value={(profile as any).establishedYear || '-'} icon={<FaInfoCircle />} />
                  </>}
                </div>
                <div className={styles.sectionDivider}></div>
                {/* Only show Professional Information for Doctor and Medical Student */}
                {(isDoctor || isMedicalStudent) && <>
                  <div className={styles.sectionSubTitle}>Professional Information</div>
                  <div className={styles.detailGrid}>
                    {isDoctor && <>
                      <InfoBox label="Specialty" value={profile.specialty || '-'} icon={<FaStethoscope />} />
                      <InfoBox label="Location" value={profile.location || '-'} icon={<FaMapMarkerAlt />} />
                      <InfoBox
                        label="Higher Education Interest"
                        value={profile.higherEducation === 'yes' ? <span style={{ color: '#22c55e', fontWeight: 600 }}>Yes</span> : <span style={{ color: '#ef4444', fontWeight: 600 }}>No</span>}
                        icon={<FaGraduationCap />}
                      />
                    </>}
                    {isMedicalStudent && <>
                      <InfoBox label="Current Institute" value={profile.currentInstitute || profile.current_institute || '-'} icon={<FaUniversity />} />
                      <InfoBox label="Year of Study" value={profile.yearOfStudy || profile.year_of_study || '-'} icon={<FaInfoCircle />} />
                      <InfoBox label="Field of Study" value={profile.fieldOfStudy || profile.field_of_study || '-'} icon={<FaInfoCircle />} />
                      <InfoBox label="Location" value={profile.location || '-'} icon={<FaMapMarkerAlt />} />
                      <InfoBox label="Higher Education Interest" value={(profile.higherEducation || profile.higher_education) === 'yes' ? <span style={{ color: '#22c55e', fontWeight: 600 }}>Yes</span> : <span style={{ color: '#ef4444', fontWeight: 600 }}>No</span>} icon={<FaGraduationCap />} />
                    </>}
                  </div>
                  <div className={styles.sectionDivider}></div>
                </>}
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

export const InfoBox: React.FC<{ label: string; value: any; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.97rem', color: '#184389', fontWeight: 600, marginBottom: 5, marginLeft: 2, letterSpacing: 0.1 }}>
      <span style={{ fontSize: '1.05rem', width: 22, height: 22, marginRight: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      {label}
    </div>
    <div className={styles.infoBox} style={{ padding: '0.85rem 1rem', fontSize: '0.93rem', minHeight: 34, background: '#f8fafc', borderRadius: 10, boxShadow: '0 1px 4px rgba(24,67,137,0.04)' }}>
      <div className={styles.infoValue} style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: 600, marginTop: 1 }}>{value}</div>
    </div>
  </div>
);

export default ProfilePage;
