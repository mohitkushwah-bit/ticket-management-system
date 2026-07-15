import { Router } from 'express';

import { RoleController } from '../controllers/role.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createRoleSchema, updateRoleSchema } from './validation-schemas';

const router = Router();

// All role routes require admin
router.get('/', authenticate, authorize('admin'), RoleController.getAll);
router.get('/:id', authenticate, authorize('admin'), RoleController.getById);
router.post('/', authenticate, authorize('admin'), validate(createRoleSchema), RoleController.create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateRoleSchema), RoleController.update);
router.delete('/:id', authenticate, authorize('admin'), RoleController.delete);

export default router;
