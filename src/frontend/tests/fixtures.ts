import { Role, RolePermissions, Ticket, User } from '@/types';

const now = new Date().toISOString();

export const authUserId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';
export const agentUserId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
export const adminRoleId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const agentRoleId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const ticketId = '11111111-1111-1111-1111-111111111111';

export const defaultPermissions: RolePermissions = {
  dashboard: { read: true, write: false },
  tickets: { read: true, write: true },
  kanban: { read: true, write: false },
  users: { read: false, write: false },
  roles: { read: false, write: false },
};

export const sampleUser: User = {
  id: agentUserId,
  name: 'Bob Agent',
  email: 'bob@example.com',
  roleId: agentRoleId,
  role: 'agent',
  createdAt: now,
  updatedAt: now,
};

export const sampleTicket: Ticket = {
  id: ticketId,
  title: 'Login page broken',
  description: 'Users cannot sign in on mobile.',
  priority: 'high',
  status: 'open',
  assignedTo: agentUserId,
  prLink: null,
  createdBy: authUserId,
  createdAt: now,
  updatedAt: now,
};

export const sampleRoles: Role[] = [
  {
    id: adminRoleId,
    name: 'admin',
    description: 'Full system access',
    permissions: {
      ...defaultPermissions,
      users: { read: true, write: true },
      roles: { read: true, write: true },
    },
    createdAt: now,
  },
  {
    id: agentRoleId,
    name: 'agent',
    description: 'Support agent',
    permissions: defaultPermissions,
    createdAt: now,
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'custom',
    description: 'Custom role',
    permissions: defaultPermissions,
    createdAt: now,
  },
];
