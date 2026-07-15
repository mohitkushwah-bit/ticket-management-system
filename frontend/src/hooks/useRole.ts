import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role as UserRole | undefined;

  return useMemo(() => ({
    role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isAgent: role === 'agent',
    canWrite: role === 'admin' || role === 'user',
    hasRole: (...roles: UserRole[]) => !!role && roles.includes(role),
  }), [role]);
};
