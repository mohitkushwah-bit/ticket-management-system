import { vi } from 'vitest';

import { authUserId } from './fixtures';

export const mockNavigate = vi.fn();
export const mockShowToast = vi.fn();
export const mockCanWrite = { value: true };

export const mockAuthUser = {
  id: authUserId,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

vi.mock('@/context/ToastContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ToastContext')>('@/context/ToastContext');
  return {
    ...actual,
    useToast: () => ({ showToast: mockShowToast }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockAuthUser,
    isAuthenticated: true,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: unknown }) => children,
}));

vi.mock('@/hooks/useRole', () => ({
  useRole: () => ({
    role: 'admin' as const,
    isAdmin: true,
    isUser: false,
    isAgent: false,
    canWrite: mockCanWrite.value,
    hasRole: (...roles: string[]) => roles.includes('admin'),
  }),
}));
