import React from 'react';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <NavBarContainer>
      <Logo>
        <span style={{ color: '#2E5FB7' }}>Medi</span>
        <span style={{ color: '#000' }}>Connect</span>
      </Logo>
    </NavBarContainer>
  );
};

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

export default Navbar;
