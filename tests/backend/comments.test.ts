import request from 'supertest';

import app from '../../src/backend/src/app';
import { USER_TOKEN, TEST_USERS } from './helpers';

process.env.DB_NAME = 'ticket_management_test';

const VALID_USER_ID = TEST_USERS.user.userId;
const EXISTING_TICKET_ID = '11111111-1111-1111-1111-111111111111';
const NON_EXISTENT_TICKET_ID = '00000000-0000-0000-0000-000000000000';

describe('Comments', () => {
  describe('POST /api/tickets/:id/comments', () => {
    it('adds a comment to existing ticket (201)', async () => {
      const res = await request(app)
        .post(`/api/tickets/${EXISTING_TICKET_ID}/comments`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          message: 'This is a test comment',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.message).toBe('This is a test comment');
      expect(res.body.data.ticketId).toBe(EXISTING_TICKET_ID);
    });

    it('rejects comment with empty message (422)', async () => {
      const res = await request(app)
        .post(`/api/tickets/${EXISTING_TICKET_ID}/comments`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          message: '',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('returns 404 for non-existent ticket', async () => {
      const res = await request(app)
        .post(`/api/tickets/${NON_EXISTENT_TICKET_ID}/comments`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .send({
          message: 'Comment on ghost ticket',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(404);
    });

    it('rejects unauthenticated request (401)', async () => {
      const res = await request(app)
        .post(`/api/tickets/${EXISTING_TICKET_ID}/comments`)
        .send({
          message: 'No auth comment',
          createdBy: VALID_USER_ID,
        });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tickets/:id/comments', () => {
    it('returns comments for a ticket', async () => {
      const res = await request(app)
        .get(`/api/tickets/${EXISTING_TICKET_ID}/comments`)
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('message');
      expect(res.body.data[0]).toHaveProperty('createdBy');
    });

    it('returns 404 for non-existent ticket', async () => {
      const res = await request(app)
        .get(`/api/tickets/${NON_EXISTENT_TICKET_ID}/comments`)
        .set('Authorization', `Bearer ${USER_TOKEN}`);
      expect(res.status).toBe(404);
    });
  });
});
