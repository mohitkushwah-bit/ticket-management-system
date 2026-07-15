import { Request, Response, NextFunction } from 'express';

import { UserRole } from '../models/types';

/**
 * Role-based authorization middleware.
 * Must be used AFTER the authenticate middleware.
 * Accepts a list of roles that are allowed to access the route.
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ errors: [{ message: 'Authentication required' }] });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ errors: [{ message: 'You do not have permission to perform this action' }] });
      return;
    }

    next();
  };
};
