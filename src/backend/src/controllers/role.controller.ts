import { Request, Response, NextFunction } from 'express';

import { RoleService } from '../services/role.service';

const roleService = new RoleService();

export class RoleController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await roleService.getAllRoles();
      res.json({ data: roles });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.json({ data: role });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.createRole(req.body);
      res.status(201).json({ data: role });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.updateRole(req.params.id, req.body);
      res.json({ data: role });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roleService.deleteRole(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
