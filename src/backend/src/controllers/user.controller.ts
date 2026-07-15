import { Request, Response, NextFunction } from 'express';

import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, roleId } = req.body;
      const user = await userService.createUser({ name, email, password, roleId });
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, roleId, password } = req.body;
      const user = await userService.updateUser(req.params.id, { name, email, roleId, password });
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
