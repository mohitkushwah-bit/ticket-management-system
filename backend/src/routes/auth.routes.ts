import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Rate limit login attempts — 10 per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { errors: [{ message: 'Too many login attempts. Please try again later.' }] },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, AuthController.login);
router.get('/me', authenticate, AuthController.getMe);
router.patch('/me', authenticate, AuthController.updateProfile);

export default router;
