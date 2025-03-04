import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import styled from "styled-components";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-shape" />

      <div className="footer-content">
        {/* Left Column: Address, phone, email */}
        <div className="footer-col">
        <Logo>
           <span style={{ color: '#2E5FB7' }}>Medi</span>
           <span style={{ color: '#000' }}>Connect</span>
        </Logo>
       
          <p className="footer-item">
            <FaMapMarkerAlt className="footer-icon" /> 12 Anywhere Ave, City 12345
          </p>
          <p className="footer-item">
            <FaPhone className="footer-icon" /> +91 789 123 456
          </p>
          <p className="footer-item">
            <FaEnvelope className="footer-icon" /> hello@example.com
          </p>
        </div>

        {/* Middle Column: Navigation links */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Quick Links</h4>
          <a href="/" className="footer-link">Home</a>
          <a href="/doctors" className="footer-link">Doctors</a>
          <a href="/faq" className="footer-link">F.A.Q</a>
          <a href="/appointments" className="footer-link">Appointments</a>
          <a href="/about" className="footer-link">About Us</a>
          <a href="/contact" className="footer-link">Contact Us</a>
          <a href="/blog" className="footer-link">Blog</a>
          <a href="/students" className="footer-link">Students</a>
          <a href="/terms" className="footer-link">Terms &amp; Conditions</a>
        </div>

        {/* Right Column: Social media */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Follow Us</h4>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaInstagram className="footer-icon" /> Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaFacebook className="footer-icon" /> Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};
const Logo = styled.div`
font-size: 1.5rem;
font-weight: bold;
cursor: pointer;
`;

export default Footer;
