import request from 'supertest';

import app from '../src/app';
import { USER_TOKEN, AGENT_TOKEN, TEST_USERS } from './helpers';

process.env.DB_NAME = 'ticket_management_test';

const VALID_USER_ID = TEST_USERS.user.userId;
const AGENT_USER_ID = TEST_USERS.agent.userId;

describe('Ticket CRUD', () => {
  describe('POST /api/tickets', () => {
    it('creates a ticket with valid data (201)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'New test ticket',
          description: 'A valid test ticket description',
          priority: 'medium',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('New test ticket');
      expect(res.body.data.status).toBe('open');
    });

    it('creates a ticket with assignee and prLink (201)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Ticket with assignee',
          description: 'Full details ticket',
          priority: 'high',
          assignedTo: AGENT_USER_ID,
          prLink: 'https://github.com/org/repo/pull/99',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(201);
      expect(res.body.data.assignedTo).toBe(AGENT_USER_ID);
      expect(res.body.data.prLink).toBe('https://github.com/org/repo/pull/99');
    });

    it('rejects ticket with missing title (422)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          description: 'No title provided',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.some((e: { field: string }) => e.field === 'title')).toBe(true);
    });

    it('rejects ticket with missing description (422)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Missing description',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(422);
      expect(res.body.errors.some((e: { field: string }) => e.field === 'description')).toBe(true);
    });

    it('rejects ticket with invalid priority (422)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Invalid priority',
          description: 'Testing invalid enum',
          priority: 'urgent',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(422);
    });

    it('rejects unauthenticated request (401)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'No auth',
          description: 'Should fail',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(401);
    });

    it('rejects agent creating ticket (403)', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${AGENT_TOKEN}`)
        .send({
          title: 'Agent ticket',
          description: 'Agents are read-only',
          priority: 'low',
          createdBy: AGENT_USER_ID,
        });
      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/tickets/:id', () => {
    let ticketId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Ticket to update',
          description: 'Will be updated',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      ticketId = res.body.data.id;
    });

    it('updates title, description, priority (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Updated title',
          description: 'Updated description',
          priority: 'critical',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated title');
      expect(res.body.data.priority).toBe('critical');
    });

    it('updates assignedTo (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ assignedTo: AGENT_USER_ID });
      expect(res.status).toBe(200);
      expect(res.body.data.assignedTo).toBe(AGENT_USER_ID);
    });

    it('updates prLink (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ prLink: 'https://github.com/org/repo/pull/100' });
      expect(res.status).toBe(200);
      expect(res.body.data.prLink).toBe('https://github.com/org/repo/pull/100');
    });

    it('rejects update with invalid priority (422)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ priority: 'super_high' });
      expect(res.status).toBe(422);
    });

    it('returns 404 for non-existent ticket', async () => {
      const res = await request(app)
        .patch('/api/tickets/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ title: 'Ghost ticket' });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/tickets', () => {
    it('returns paginated list of tickets', async () => {
      const res = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('totalPages');
    });

    it('filters by status', async () => {
      const res = await request(app)
        .get('/api/tickets?status=open')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      res.body.data.forEach((ticket: { status: string }) => {
        expect(ticket.status).toBe('open');
      });
    });

    it('searches by keyword', async () => {
      const res = await request(app)
        .get('/api/tickets?search=Safari')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('rejects invalid status filter (422)', async () => {
      const res = await request(app)
        .get('/api/tickets?status=invalid')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(422);
    });

    it('rejects invalid priority filter (422)', async () => {
      const res = await request(app)
        .get('/api/tickets?priority=invalid')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('returns ticket details (200)', async () => {
      const res = await request(app)
        .get('/api/tickets/11111111-1111-1111-1111-111111111111')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('status');
    });

    it('returns 404 for non-existent ticket', async () => {
      const res = await request(app)
        .get('/api/tickets/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(404);
    });
  });
});
