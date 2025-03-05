import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DoctorForm from '../register/forms/DoctorForm';
import MedicalStudentForm from '../register/forms/MedicalStudentForm';
import RecruiterForm from '../register/forms/RecruiterForm';
import EducationalInstituteForm from '../register/forms/EducationalInstituteForm';
import { InputGroup, Label, Input, Select } from '../components/StyledFormComponents';
import Navbar from '../components/Navbar';

type UserType = 'doctor' | 'medical_student' | 'recruiter' | 'educational_institute' | '';

interface FormData {
  userType: UserType;
  email: string;
  password: string;
  confirmPassword: string;
  profession?: string;
  specialty?: string;
  location?: string;
  higherEducation?: string;
  currentInstitute?: string;
  yearOfStudy?: string;
  fieldOfStudy?: string;
  companyName?: string;
  position?: string;
  industryType?: string;
  instituteName?: string;
  instituteType?: string;
  accreditation?: string;
  establishedYear?: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt with:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #E6F0FF 0%, #FFFFFF 100%);
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  height: 100%;
`;

const RegisterSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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