import React from "react";
import styled from "styled-components";
import { FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

interface StyledLinkProps {
  href?: string;
}

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: auto;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLogo = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  
  span {
    color: #E6F0FF;
  }
`;

const CompanyDescription = styled.p`
  color: #E6F0FF;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #E6F0FF;
  
  svg {
    color: #E6F0FF;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 2rem;
    height: 2px;
    background: #E6F0FF;
  }
`;

const FooterLink = styled.a<StyledLinkProps>`
  color: #E6F0FF;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled(FooterLink)`
  background: rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #E6F0FF;
    transform: translateY(-3px);
  }
  
  svg {
    font-size: 18px;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  color: #E6F0FF;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <div>
          <FooterLogo>
            <span>Medi</span>Connect
          </FooterLogo>
          <CompanyDescription>
            Connecting healthcare professionals with opportunities worldwide. Your trusted partner in medical career advancement and healthcare staffing solutions.
          </CompanyDescription>
          <ContactInfo>
            <ContactItem>
              <FaMapMarkerAlt size={16} />
              123 Healthcare Avenue, Medical District
            </ContactItem>
            <ContactItem>
              <FaPhone size={16} />
              +1 (555) 123-4567
            </ContactItem>
            <ContactItem>
              <FaEnvelope size={16} />
              contact@mediconnect.com
            </ContactItem>
          </ContactInfo>
        </div>
        
        <FooterColumn>
          <FooterTitle>Company</FooterTitle>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Recruiters</FooterLink>
          <FooterLink href="#">Doctors</FooterLink>
          <FooterLink href="#">Advertisement</FooterLink>
          <FooterLink href="#">Appointment</FooterLink>
          <FooterLink href="#">Testimonials</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="#">Students</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
          <FooterLink href="#">FAQs</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms and Conditions</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Connect With Us</FooterTitle>
          <CompanyDescription>
            Follow us on social media to stay updated with the latest healthcare opportunities and industry news.
          </CompanyDescription>
          <SocialLinks>
            <SocialLink href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="#" aria-label="Facebook">
              <FaFacebook />
            </SocialLink>
          </SocialLinks>
        </FooterColumn>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
