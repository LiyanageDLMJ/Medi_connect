import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <NavBarContainer>
      <LogoLink to="/">
        <span style={{ color: '#2E5FB7' }}>Medi</span>
        <span style={{ color: '#000' }}>Connect</span>
      </LogoLink>
    </NavBarContainer>
  );
};

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  width: 100%;
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export default Navbar;
