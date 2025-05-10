// layouts/WithoutFooter.tsx
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const WithoutFooter = ({ children }: LayoutProps) => <>{children}</>;

export default WithoutFooter;