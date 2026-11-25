import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Role/Physician/components/NavBar/Sidebar';
import MedicalStudentSidebar from '../Role/MedicalStudent/components/Sidebar';
import HigherEducationSidebar from '../Role/higherEducation/components/Sidebar';
import RecruiterSidebar from '../Role/Recuiter/components/NavBar/Sidebar';

interface SidebarWrapperProps {
  children?: ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine which sidebar to show based on the current route
  const getSidebar = () => {
    if (pathname.startsWith('/physician')) {
      return <Sidebar />;
    } else if (pathname.startsWith('/medical_student')) {
      return <MedicalStudentSidebar />;
    } else if (pathname.startsWith('/higher-education')) {
      return <HigherEducationSidebar />;
    } else if (pathname.startsWith('/recruiter')) {
      return <RecruiterSidebar />;
    }
    // Default to physician sidebar
    return <Sidebar />;
  };

  return (
    <div className="flex min-h-screen">
      {getSidebar()}
      {children ? (
        <div className="flex-1 overflow-auto px-4">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SidebarWrapper;