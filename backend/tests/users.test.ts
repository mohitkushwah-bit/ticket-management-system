import request from 'supertest';

import app from '../src/app';
import { ADMIN_TOKEN, USER_TOKEN, AGENT_TOKEN } from './helpers';

process.env.DB_NAME = 'ticket_management_test';

let adminRoleId: string;

describe('Users CRUD', () => {
  beforeAll(async () => {
    // Get the admin role ID for creating test users
    const rolesRes = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
    adminRoleId = rolesRes.body.data.find((r: { name: string }) => r.name === 'user').id;
  });

  describe('GET /api/users', () => {
    it('should return all users for authenticated user (200)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('email');
      expect(res.body.data[0]).toHaveProperty('role');
    });

    it('should not expose password hash in response', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      res.body.data.forEach((u: Record<string, unknown>) => {
        expect(u).not.toHaveProperty('passwordHash');
        expect(u).not.toHaveProperty('password_hash');
      });
    });

    it('should reject unauthenticated request (401)', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID (200)', async () => {
      const listRes = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      const userId = listRes.body.data[0].id;

      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user as admin (201)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test User');
      expect(res.body.data.email).toBe('testuser@example.com');
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    it('should reject duplicate email (400)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Duplicate',
          email: 'alice@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('already in use');
    });

    it('should reject weak password (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Weak Pass',
          email: 'weakpass@example.com',
          password: 'short',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(422);
    });

    it('should reject password without uppercase (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'No Upper',
          email: 'noupper@example.com',
          password: 'password1',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(422);
    });

    it('should reject password without digit (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'No Digit',
          email: 'nodigit@example.com',
          password: 'Password',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(422);
    });

    it('should reject missing name (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          email: 'noname@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(422);
    });

    it('should reject invalid email format (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Bad Email',
          email: 'not-an-email',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(422);
    });

    it('should reject invalid roleId (422)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Bad Role',
          email: 'badrole@example.com',
          password: 'Passw0rd!',
          roleId: 'not-a-uuid',
        });
      expect(res.status).toBe(422);
    });

    it('should reject non-admin user creating users (403)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          name: 'Unauthorized',
          email: 'unauth@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(403);
    });

    it('should reject agent creating users (403)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${AGENT_TOKEN}`)
        .send({
          name: 'Agent Create',
          email: 'agentcreate@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/users/:id', () => {
    let testUserId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'User To Update',
          email: 'updateme@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      testUserId = res.body.data.id;
    });

    it('should update user name (200)', async () => {
      const res = await request(app)
        .patch(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('should update user email (200)', async () => {
      const res = await request(app)
        .patch(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ email: 'newemail@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('newemail@example.com');
    });

    it('should reject duplicate email on update (400)', async () => {
      const res = await request(app)
        .patch(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ email: 'alice@example.com' });
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .patch('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ name: 'Ghost' });
      expect(res.status).toBe(404);
    });

    it('should reject non-admin user updating (403)', async () => {
      const res = await request(app)
        .patch(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ name: 'Hacked' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user with no tickets (204)', async () => {
      // Create a fresh user to delete
      const createRes = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({
          name: 'Delete Me',
          email: 'deleteme@example.com',
          password: 'Passw0rd!',
          roleId: adminRoleId,
        });
      const userId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(204);

      // Verify deletion
      const getRes = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(getRes.status).toBe(404);
    });

    it('should reject deleting user with tickets (400)', async () => {
      // Charlie (user) has created tickets in seed data
      const res = await request(app)
        .delete(`/api/users/c3d4e5f6-a7b8-9012-cdef-123456789012`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('ticket');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
      expect(res.status).toBe(404);
    });

    it('should reject non-admin user deleting (403)', async () => {
      const res = await request(app)
        .delete('/api/users/d4e5f6a7-b8c9-0123-def0-234567890123')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(403);
    });
  });
});
