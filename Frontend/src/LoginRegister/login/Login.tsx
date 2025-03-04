import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { InputGroup, Label, Input } from '../components/StyledFormComponents';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
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
            </InputGroup>
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

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background: transparent;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  &:hover {
    color: #2E5FB7;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem;
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

export default LoginPage;