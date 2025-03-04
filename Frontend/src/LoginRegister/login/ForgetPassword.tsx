import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { InputGroup, Label, Input } from '../components/StyledFormComponents';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to send reset password email
    console.log('Reset password requested for:', email);
    setIsSubmitted(true);
  }

  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        <Section>
          <Title>Forgot Password</Title>
          {!isSubmitted ? (
            <>
              <Description>
                Enter your email address and we'll send you instructions to reset your password.
              </Description>
              <Form onSubmit={handleSubmit}>
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
                <SubmitButton type="submit">
                  Send Reset Link <span>→</span>
                </SubmitButton>
              </Form>
            </>
          ) : (
            <SuccessMessage>
              If an account exists with {email}, you will receive password reset instructions.
            </SuccessMessage>
          )}
          <BackToLogin>
            <Link to="/login">← Back to Login</Link>
          </BackToLogin>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
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
`;

const Section = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SubmitButton = styled.button`
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

const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: #2E5FB7;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default ForgotPassword;
