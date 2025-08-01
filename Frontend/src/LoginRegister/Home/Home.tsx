import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaSearch, FaCalendarCheck, FaChartLine, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Container>
        <Navbar />
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              Your Gateway to 
            </HeroTitle>
            <HeroSubtitle>
              Connect with top healthcare institutions, advance your medical career, and make a difference in patient care.
            </HeroSubtitle>
            <HeroButtons>
              <PrimaryButton to="/login">Login</PrimaryButton>
              <SecondaryButton to="/register">Register Now</SecondaryButton>
            </HeroButtons>
          </HeroContent>
        </HeroSection>

        <StatsSection>
          <StatsContainer>
            <StatItem>
              <StatNumber>5000+</StatNumber>
              <StatLabel>Healthcare Professionals</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>1000+</StatNumber>
              <StatLabel>Medical Institutions</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>98%</StatNumber>
              <StatLabel>Satisfaction Rate</StatLabel>
            </StatItem>
          </StatsContainer>
        </StatsSection>

        <FeaturesSection>
          <SectionTitle>Why Choose MediConnect?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon><FaUserMd /></FeatureIcon>
              <FeatureTitle>Expert Network</FeatureTitle>
              <FeatureText>Connect with leading healthcare professionals and institutions worldwide.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon><FaHospital /></FeatureIcon>
              <FeatureTitle>Top Institutions</FeatureTitle>
              <FeatureText>Partner with prestigious medical facilities and organizations.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon><FaSearch /></FeatureIcon>
              <FeatureTitle>Smart Matching</FeatureTitle>
              <FeatureText>Find the perfect opportunities matching your skills and preferences.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon><FaCalendarCheck /></FeatureIcon>
              <FeatureTitle>Easy Scheduling</FeatureTitle>
              <FeatureText>Efficiently manage appointments and schedules in one place.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon><FaChartLine /></FeatureIcon>
              <FeatureTitle>Career Growth</FeatureTitle>
              <FeatureText>Access resources and opportunities for professional development.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon><FaUsers /></FeatureIcon>
              <FeatureTitle>Community</FeatureTitle>
              <FeatureText>Join a thriving community of healthcare professionals.</FeatureText>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        <CTASection>
          <CTAContent>
            <CTATitle>Ready to Transform Healthcare?</CTATitle>
            <CTAText>Join MediConnect today and be part of the future of healthcare staffing.</CTAText>
            <CTAButtons>
              <PrimaryButton to="/register">Get Started</PrimaryButton>
              <SecondaryButton to="/login">Sign In</SecondaryButton>
            </CTAButtons>
          </CTAContent>
        </CTASection>
      </Container>
    </>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  position: relative;
  background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
  background-image: url("https://www.itl.cat/pngfile/big/12-126969_amazing-4k-ultra-hd-doctors-pictures-backgrounds-medical.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  padding: 4rem 2rem 3rem;
  text-align: center;
  z-index: 1;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(46, 95, 183, 0.6) 0%, rgba(26, 54, 93, 0.7) 100%);
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 3;
  }

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 3rem 2rem 2rem;
    background-attachment: scroll;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  z-index: 4;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 5;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(135deg, #25a0ec 0%, #66b0f2 100%);
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(37, 160, 236, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

const ButtonBase = styled(Link)`
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  min-width: 160px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  background: #ffffff;
  color: #2E5FB7;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(46, 95, 183, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
    border-color: rgba(46, 95, 183, 0.3);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 0.9rem;
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 1);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 0.9rem;
  }
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 5rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E5FB7' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(46, 95, 183, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
    border-radius: 2px;
    opacity: 0.6;
  }
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
  padding: 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(46, 95, 183, 0.1);
  border: 1px solid rgba(46, 95, 183, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(46, 95, 183, 0.15);
    border-color: rgba(46, 95, 183, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
    
    ${StatNumber} {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 1rem;
  }
`;

const StatLabel = styled.div`
  color: #1a365d;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  position: relative;
  z-index: 2;
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E5FB7' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  font-weight: 700;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
    border-radius: 2px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(46, 95, 183, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #25a0ec 0%, #2E5FB7 100%);
    border-radius: 22px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
  transition: color 0.3s ease;
  position: relative;
  z-index: 2;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(46, 95, 183, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(46, 95, 183, 0.08);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2E5FB7 0%, #25a0ec 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(46, 95, 183, 0.05) 0%, transparent 70%);
    transform: scale(0);
    transition: transform 0.4s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(46, 95, 183, 0.2);
    border-color: rgba(46, 95, 183, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
    
    &::after {
      transform: scale(1);
    }
    
    ${FeatureIcon} {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, #25a0ec 0%, #2E5FB7 100%);
    }
    
    ${FeatureTitle} {
      color: #2E5FB7;
    }
  }
`;

const FeatureText = styled.p`
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
  position: relative;
  z-index: 2;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #1a365d 0%, #2E5FB7 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
  }
`;

const CTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #25a0ec 0%, #2E5FB7 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export default Home;