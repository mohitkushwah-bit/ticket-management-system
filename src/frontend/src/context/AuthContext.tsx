import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { authService, AuthUser } from '../services/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(authService.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      authService.getMe()
        .then((u) => {
          setUser(u);
          authService.setAuth(token, u);
        })
        .catch(() => {
          authService.logout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: authUser } = await authService.login(email, password);
    authService.setAuth(token, authUser);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
    const token = authService.getToken();
    if (token) {
      authService.setAuth(token, updatedUser);
    }
  }, []);

  const value = useMemo(() => ({
    user, isAuthenticated: !!user, loading, login, logout, updateUser,
  }), [user, loading, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
