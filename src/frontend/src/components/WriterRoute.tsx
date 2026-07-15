import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export const WriterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canWrite } = useRole();

  if (!canWrite) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
