import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import DoctorForm from '../register/forms/DoctorForm';
import MedicalStudentForm from '../register/forms/MedicalStudentForm';
import RecruiterForm from '../register/forms/RecruiterForm';
import EducationalInstituteForm from '../register/forms/EducationalInstituteForm';
import { InputGroup, Label, Input, Select } from '../components/StyledFormComponents';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

type UserType = 'doctor' | 'medical_student' | 'recruiter' | 'educational_institute' | '';

interface FormData {
  userType: UserType;
  email: string;
  password: string;
  confirmPassword: string;
  idPhoto?: File | null;
  // Doctor fields
  profession?: string;
  specialty?: string;
  location?: string;
  higherEducation?: string;
  otherSpecialty?: string; // Added for 'Other' specialty
  // Medical Student fields
  currentInstitute?: string;
  yearOfStudy?: string;
  fieldOfStudy?: string;
  otherFieldOfStudy?: string; // Added for 'Other' field of study
  // Recruiter fields
  companyName?: string;
  companyType?: string;
  position?: string;
  contactNumber?: string;
  // Educational Institute fields
  instituteName?: string;
  instituteType?: string;
  accreditation?: string;
  establishedYear?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Simple client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match'); // Show error toast
      return;
    }
    if (!formData.userType) {
      setError('Please select a user type');
      toast.error('Please select a user type'); // Show error toast
      return;
    }

    try {
      const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

      // Prepare payload, handling 'Other' fields
      let payload: any = { ...formData };
      // Doctor: handle specialty
      if (formData.userType === 'doctor' && formData.specialty === 'Other (please specify)') {
        payload.specialty = formData.otherSpecialty || '';
        delete payload.otherSpecialty;
      }
      // Medical Student: handle fieldOfStudy
      if (formData.userType === 'medical_student' && formData.fieldOfStudy === 'Other (please specify)') {
        payload.fieldOfStudy = formData.otherFieldOfStudy || '';
        delete payload.otherFieldOfStudy;
      }

      // If idPhoto present, convert to base64 string so we can still send JSON
      if (formData.idPhoto) {
        const file = formData.idPhoto as File;
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload.idPhotoBase64 = base64;
        delete payload.idPhoto;
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Registration failed'); // Show error toast
        throw new Error(data.message || 'Registration failed');
      }

      // Show success toast on registration
      toast.success('Registration successful! Please log in.');
      setMessage('Registration successful! Please log in. Redirecting to login page...');

      // Wait a moment so the user can read the success message, then send to login
      setTimeout(() => navigate('/login'), 1500);
      // Optionally reset form
      setFormData({
        userType: '',
        email: '',
        password: '',
        confirmPassword: '',
        idPhoto: null,
      } as FormData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Error toast already shown above
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        idPhoto: fileInput.files?.[0] || null,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: (e.target as any).value,
      });
    }
  };

  return (
    <RegisterContainer>
      <Navbar />
      <ContentWrapper>
        <RegisterSection>
          <RegisterTitle>Register</RegisterTitle>
          <RegisterForm onSubmit={handleSubmit}>
            <InputGroup>
              <Label>User Type</Label>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">Select User Type</option>
                <option value="doctor">Doctor</option>
                <option value="medical_student">Medical Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="educational_institute">Educational Institute</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder=""
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputGroup>

            {formData.userType === 'doctor' && <DoctorForm formData={formData} handleChange={handleChange} />}
            {formData.userType === 'medical_student' && <MedicalStudentForm formData={formData} handleChange={handleChange} />}
            {formData.userType === 'recruiter' && <RecruiterForm formData={formData} handleChange={handleChange} />}
            {formData.userType === 'educational_institute' && <EducationalInstituteForm formData={formData} handleChange={handleChange} />}

            <RegisterButton type="submit">
              Register <span>→</span>
            </RegisterButton>

            <RegisterLink>
              Already have an account? <Link to="/login">Login</Link>
            </RegisterLink>
          </RegisterForm>
        </RegisterSection>
      </ContentWrapper>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #E6F0FF 0%, #FFFFFF 100%);
  padding-bottom: 250px; /* Increased padding to ensure more space for the form */
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  padding-bottom: 4rem; /* Added extra padding at the bottom */
  width: 100%;
  min-height: calc(100vh - 250px); /* Ensure minimum height with footer space */
`;

const RegisterSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; /* Increased max-width for better form display */
  margin: 2rem auto;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const RegisterButton = styled.button`
  background: #2E5FB7;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
  
  &:hover {
    background: #254a8f;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  color: #666;
  
  a {
    color: #2E5FB7;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register;