import { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/error-handler';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
      }

      const result = await authService.login(email, password);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }

      const user = await authService.getMe(req.user.userId);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }

      const { name, email, currentPassword, newPassword } = req.body;
      const user = await authService.updateProfile(req.user.userId, {
        name,
        email,
        currentPassword,
        newPassword,
      });
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }
}
