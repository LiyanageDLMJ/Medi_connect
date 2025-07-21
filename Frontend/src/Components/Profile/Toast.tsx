import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToastContainer = styled.div<{show: boolean}>`
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 90vw;
  background: #184389;
  color: #fff;
  padding: 1.1rem 2.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(24, 67, 137, 0.12);
  font-size: 1.1rem;
  z-index: 9999;
  opacity: ${({show}) => show ? 1 : 0};
  pointer-events: ${({show}) => show ? 'auto' : 'none'};
  animation: ${fadeIn} 0.4s cubic-bezier(.4,0,.2,1);
  transition: opacity 0.3s;
`;

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  return <ToastContainer show={show}>{message}</ToastContainer>;
};

export default Toast;
