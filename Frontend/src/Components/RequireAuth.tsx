import React, { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // Authentication temporarily bypassed so all pages are accessible
  return <>{children}</>;
};

export default RequireAuth;
