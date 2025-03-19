import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navBar flex justify-between items-center p-[3rem] gap-30">
      {/* Logo */}
      <Logo>
        <span style={{ color: '#2E5FB7' }}>Medi</span>
        <span style={{ color: '#000' }}>Connect</span>
      </Logo>

      {/* Navigation Menu */}
      <ul className="menu flex gap-10">
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="/profile">Your Profile</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="/degree-listing">Degree Listing</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="/messages">Messages</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="view-applications">View Applications</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600">
          <Link to="/performance-insights">Performance Insights</Link>
        </li>
      </ul>
    </nav>
  );
};

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

export default NavBar;


// /higher-education

