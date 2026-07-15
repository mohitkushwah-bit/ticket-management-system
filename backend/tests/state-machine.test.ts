import request from 'supertest';

import app from '../src/app';
import { USER_TOKEN, TEST_USERS } from './helpers';

process.env.DB_NAME = 'ticket_management_test';

const VALID_USER_ID = TEST_USERS.user.userId;
const OPEN_TICKET_ID = '22222222-2222-2222-2222-222222222222';
const IN_PROGRESS_TICKET_ID = '11111111-1111-1111-1111-111111111111';
const RESOLVED_TICKET_ID = '44444444-4444-4444-4444-444444444444';
const CLOSED_TICKET_ID = '55555555-5555-5555-5555-555555555555';
const CANCELLED_TICKET_ID = '66666666-6666-6666-6666-666666666666';

describe('Ticket Status State Machine', () => {
  describe('Valid transitions', () => {
    it('Open → In Progress (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${OPEN_TICKET_ID}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'in_progress' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in_progress');
    });

    it('In Progress → Resolved (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${IN_PROGRESS_TICKET_ID}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'resolved' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('resolved');
    });

    it('Resolved → Closed (200)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${RESOLVED_TICKET_ID}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'closed' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('closed');
    });

    it('Open → Cancelled (200)', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Test cancellation from open',
          description: 'This ticket will be cancelled',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'cancelled' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('cancelled');
    });

    it('In Progress → Cancelled (200)', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Test cancellation from in_progress',
          description: 'This ticket will be cancelled from in_progress',
          priority: 'medium',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'in_progress' });

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'cancelled' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('cancelled');
    });
  });

  describe('Invalid transitions', () => {
    it('Open → Resolved is rejected (422)', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Test invalid transition',
          description: 'Open cannot go directly to resolved',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'resolved' });
      expect(res.status).toBe(422);
      expect(res.body.errors[0].message).toContain('Invalid status transition');
    });

    it('Open → Closed is rejected (422)', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Test invalid open to closed',
          description: 'Cannot skip resolved',
          priority: 'low',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'closed' });
      expect(res.status).toBe(422);
    });

    it('Closed → any status is rejected (terminal state)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${CLOSED_TICKET_ID}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'open' });
      expect(res.status).toBe(422);
      expect(res.body.errors[0].message).toContain('terminal state');
    });

    it('Cancelled → any status is rejected (terminal state)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${CANCELLED_TICKET_ID}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'open' });
      expect(res.status).toBe(422);
      expect(res.body.errors[0].message).toContain('terminal state');
    });

    it('Resolved → In Progress is rejected (422)', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Test resolved regression',
          description: 'Resolved cannot go back to in_progress',
          priority: 'medium',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'in_progress' });
      await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'resolved' });

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'in_progress' });
      expect(res.status).toBe(422);
    });
  });

  describe('Status persists in database', () => {
    it('Status is actually updated in DB after valid transition', async () => {
      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          title: 'Persistence test',
          description: 'Verify DB persistence',
          priority: 'high',
          createdBy: VALID_USER_ID,
        });
      const ticketId = createRes.body.data.id;

      await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({ status: 'in_progress' });

      const getRes = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(getRes.body.data.status).toBe('in_progress');
    });
  });
});
