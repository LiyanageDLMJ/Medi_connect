import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaSearch, FaCalendarCheck, FaChartLine, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
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
  );
};

const Container = styled.div`
height: 100vh;
width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  position: relative;
  background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
  background-image: url("https://www.itl.cat/pngfile/big/12-126969_amazing-4k-ultra-hd-doctors-pictures-backgrounds-medical.jpg");
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(30, 60, 120, 0.6);
 
    z-index: -1;
  }
`;



const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ButtonBase = styled(Link)`
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
`;

const PrimaryButton = styled(ButtonBase)`
  background: #ffffff;
  color: #2E5FB7;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: transparent;
  color: white;
  border: 2px solid white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 4rem 2rem;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2E5FB7;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1.1rem;
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: #f8fafc;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: #2E5FB7;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const FeatureText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export default Home;