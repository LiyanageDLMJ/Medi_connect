import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navBar flex justify-between items-center p-[3rem] gap-30">
      <Logo>
        <span style={{ color: '#2E5FB7' }}>Medi</span>
        <span style={{ color: '#000' }}>Connect</span>
      </Logo>

      <div className="menu flex gap-10">
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/dashboard")}>
          Dashboard
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/profile")}>
          Your Profile
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/JobPost")}>
          Job & Internship Post
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/JobListing")}>
          Job Listings
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/VeiwCandidates")}>
          Veiw Candidates
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600" onClick={() => navigate("/messages")}>
          Messages
        </li>
        
      </div>
    </div>
  );
};
const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

export default NavBar;
