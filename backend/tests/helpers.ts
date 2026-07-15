import jwt from 'jsonwebtoken';

import { UserRole } from '../src/models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

interface TestUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const TEST_USERS = {
  admin: {
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'alice@example.com',
    role: 'admin' as UserRole,
  },
  agent: {
    userId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    email: 'bob@example.com',
    role: 'agent' as UserRole,
  },
  user: {
    userId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    email: 'charlie@example.com',
    role: 'user' as UserRole,
  },
};

export function generateToken(user: TestUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

export const ADMIN_TOKEN = generateToken(TEST_USERS.admin);
export const AGENT_TOKEN = generateToken(TEST_USERS.agent);
export const USER_TOKEN = generateToken(TEST_USERS.user);
