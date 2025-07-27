import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { InputGroup, Label, Input } from '../components/StyledFormComponents';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

type UserType = 'Doctor' | 'MedicalStudent' | 'Recruiter' | 'EducationalInstitute';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Login failed'); // Show error toast
        throw new Error(data.message || 'Login failed');
      }

      // Store token if needed
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.user.userType);
      localStorage.setItem('userId', data.user.id);
      setMessage('Login successful! Redirecting...');
      toast.success('Login successful!'); // Show success toast

      const redirectMap: Record<UserType, string> = {
        Doctor: '/physician/DoctorDashboard',
        MedicalStudent: '/medical_student/dashboard',
        Recruiter: '/recruiter/dashboard',
        EducationalInstitute: '/higher-education/dashboard',
      };
      navigate(redirectMap[data.user.userType as UserType] || '/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Error toast already shown above
    }
  }

  return (
    <LoginContainer>
      <Navbar />
      <ContentWrapper>
        <LoginSection>
          <LoginTitle>Login</LoginTitle>
          <LoginForm onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ForgotPasswordLink>
                <Link to="/forgot-password">Forgot Password?</Link>
              </ForgotPasswordLink>
            </InputGroup>
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <LoginButton type="submit">
              Login <span>→</span>
            </LoginButton>
            <RegisterLink>
              Don't have an account? <Link to="/register">Register</Link>
            </RegisterLink>
          </LoginForm>
        </LoginSection>
      </ContentWrapper>

    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #E6F0FF 0%, #FFFFFF 100%);
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 100%;
`;

const LoginSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoginButton = styled.button`
  background:rgba(35, 23, 197, 0.84);
  background:#2E5FB7;
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
    background:rgb(26, 33, 177);
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

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  
  a {
    color: #2E5FB7;
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default LoginPage;