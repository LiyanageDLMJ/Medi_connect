// layouts/WithFooter.tsx
import { ReactNode } from 'react';
import Footer from "../Components/FooterDiv/Footer";

interface LayoutProps {
  children: ReactNode; // Explicitly type children
}

const WithFooter = ({ children }: LayoutProps) => (
  <>
    {children}
    <Footer />
  </>
);

export default WithFooter;