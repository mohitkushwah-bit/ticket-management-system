import api from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  data: {
    token: string;
    user: AuthUser;
  };
}

interface ProfileResponse {
  data: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data.data;
  },

  async getMe(): Promise<AuthUser> {
    const response = await api.get<ProfileResponse>('/auth/me');
    return response.data.data;
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<AuthUser> {
    const response = await api.patch<ProfileResponse>('/auth/me', data);
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: AuthUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
