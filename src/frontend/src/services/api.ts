import axios from 'axios';
import { ApiErrorResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized response (except for login endpoint)
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    if (error.response?.data?.errors) {
      return Promise.reject(error.response.data as ApiErrorResponse);
    }
    return Promise.reject({
      errors: [{ message: error.message || 'Network error' }],
    } as ApiErrorResponse);
  },
);

export default api;
