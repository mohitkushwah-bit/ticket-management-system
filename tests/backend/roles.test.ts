import request from 'supertest';

import app from '../../src/backend/src/app';
import { ADMIN_TOKEN, USER_TOKEN, AGENT_TOKEN } from './helpers';

process.env.DB_NAME = 'ticket_management_test';

const DEFAULT_PERMISSIONS = {
  dashboard: { read: true, write: false },
  tickets: { read: true, write: false },
  kanban: { read: true, write: false },
  users: { read: false, write: false },
  roles: { read: false, write: false },
};

describe('Roles CRUD', () => {
  describe('GET /api/roles', () => {
    it('should return all roles for admin (200)', async () => {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('permissions');
    });

    it('should reject non-admin user (403)', async () => {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(403);
    });

    it('should reject agent (403)', async () => {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${AGENT_TOKEN}`);
      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated request (401)', async () => {
      const res = await request(app).get('/api/roles');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should return a role by ID (200)', async () => {
      // First get all roles to find an ID
      const listRes = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      const roleId = listRes.body.data[0].id;

      const res = await request(app)
        .get(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(roleId);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('permissions');
    });

    it('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .get('/api/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/roles', () => {
    it('should create a new role (201)', async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'test-role',
          description: 'A test role',
          permissions: DEFAULT_PERMISSIONS,
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('test-role');
      expect(res.body.data.description).toBe('A test role');
      expect(res.body.data.permissions).toEqual(DEFAULT_PERMISSIONS);
    });

    it('should reject duplicate role name (400)', async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'admin',
          permissions: DEFAULT_PERMISSIONS,
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('already exists');
    });

    it('should reject missing name (422)', async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          permissions: DEFAULT_PERMISSIONS,
        });
      expect(res.status).toBe(422);
    });

    it('should reject missing permissions (422)', async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'incomplete-role',
        });
      expect(res.status).toBe(422);
    });

    it('should reject non-admin user (403)', async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          name: 'user-created-role',
          permissions: DEFAULT_PERMISSIONS,
        });
      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/roles/:id', () => {
    let testRoleId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'role-to-update',
          description: 'Will be updated',
          permissions: DEFAULT_PERMISSIONS,
        });
      testRoleId = res.body.data.id;
    });

    it('should update role name (200)', async () => {
      const res = await request(app)
        .patch(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ name: 'updated-role-name' });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('updated-role-name');
    });

    it('should update role description (200)', async () => {
      const res = await request(app)
        .patch(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ description: 'Updated description' });
      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe('Updated description');
    });

    it('should update role permissions (200)', async () => {
      const newPerms = {
        ...DEFAULT_PERMISSIONS,
        tickets: { read: true, write: true },
      };
      const res = await request(app)
        .patch(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ permissions: newPerms });
      expect(res.status).toBe(200);
      expect(res.body.data.permissions.tickets.write).toBe(true);
    });

    it('should reject duplicate name on update (400)', async () => {
      const res = await request(app)
        .patch(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ name: 'admin' });
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .patch('/api/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ name: 'ghost' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('should delete a custom role with no users (204)', async () => {
      // Create a role to delete
      const createRes = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'role-to-delete',
          permissions: DEFAULT_PERMISSIONS,
        });
      const roleId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(204);

      // Verify it's gone
      const getRes = await request(app)
        .get(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(getRes.status).toBe(404);
    });

    it('should reject deleting built-in role (400)', async () => {
      const listRes = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      const adminRole = listRes.body.data.find((r: { name: string }) => r.name === 'admin');

      const res = await request(app)
        .delete(`/api/roles/${adminRole.id}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('built-in');
    });

    it('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .delete('/api/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(404);
    });

    it('should reject non-admin user (403)', async () => {
      const res = await request(app)
        .delete('/api/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(403);
    });
  });
});
