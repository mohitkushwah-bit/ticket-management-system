import { Router } from 'express';

import { CommentController } from '../controllers/comment.controller';
import { TicketController } from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  changeStatusSchema,
  createCommentSchema,
  createTicketSchema,
  updateTicketSchema,
} from './validation-schemas';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

// Read routes — all roles can access
router.get('/', TicketController.getAll);
router.get('/stats/status-counts', TicketController.getStatusCounts);
router.get('/stats/resolved', TicketController.getResolvedByPeriod);
router.get('/stats/resolved-all', TicketController.getResolvedCounts);
router.get('/:id', TicketController.getById);

// Write routes — admin and user only (agent cannot create/edit/change status)
router.post('/', authorize('admin', 'user'), validate(createTicketSchema), TicketController.create);
router.patch('/:id', authorize('admin', 'user'), validate(updateTicketSchema), TicketController.update);
router.patch('/:id/status', authorize('admin', 'user'), validate(changeStatusSchema), TicketController.changeStatus);

// Comments — read: all, write: admin and user
router.get('/:id/comments', CommentController.getByTicketId);
router.post('/:id/comments', authorize('admin', 'user'), validate(createCommentSchema), CommentController.create);

export default router;
