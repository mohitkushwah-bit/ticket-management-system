import { Router } from 'express';

import authRoutes from './auth.routes';
import roleRoutes from './role.routes';
import ticketRoutes from './ticket.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
