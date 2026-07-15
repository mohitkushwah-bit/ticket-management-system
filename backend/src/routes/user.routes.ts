import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from './validation-schemas';

const router = Router();

// GET users is available to all authenticated users (for assignee dropdowns)
router.get('/', authenticate, UserController.getAll);
router.get('/:id', authenticate, UserController.getById);

// CRUD operations require admin role
router.post('/', authenticate, authorize('admin'), validate(createUserSchema), UserController.create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateUserSchema), UserController.update);
router.delete('/:id', authenticate, authorize('admin'), UserController.delete);

export default router;
