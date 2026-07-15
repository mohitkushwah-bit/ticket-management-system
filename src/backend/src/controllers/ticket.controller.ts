import { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/error-handler';
import { TicketFilters, TicketStatus, TicketPriority, TicketSortBy, SortOrder } from '../models/types';
import { TicketService } from '../services/ticket.service';

const VALID_STATUSES: readonly string[] = ['open', 'in_progress', 'resolved', 'closed', 'cancelled'];
const VALID_PRIORITIES: readonly string[] = ['low', 'medium', 'high', 'critical'];
const VALID_PERIODS: readonly string[] = ['week', 'month', 'year'];

const ticketService = new TicketService();

export class TicketController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawStatus = req.query.status as string | undefined;
      if (rawStatus && !VALID_STATUSES.includes(rawStatus)) {
        throw new AppError(422, `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}`);
      }
      const rawPriority = req.query.priority as string | undefined;
      if (rawPriority && !VALID_PRIORITIES.includes(rawPriority)) {
        throw new AppError(422, `Invalid priority filter. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
      }

      const filters: TicketFilters = {
        search: req.query.search as string | undefined,
        status: rawStatus as TicketStatus | undefined,
        priority: rawPriority as TicketPriority | undefined,
        assignedTo: req.query.assignedTo as string | undefined,
        sortBy: req.query.sortBy as TicketSortBy | undefined,
        sortOrder: req.query.sortOrder as SortOrder | undefined,
        page: Math.max(1, parseInt(req.query.page as string, 10) || 1),
        limit: Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20)),
      };
      const result = await ticketService.getAllTickets(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      res.json({ data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.createTicket({
        ...req.body,
        createdBy: req.user!.userId,
      });
      res.status(201).json({ data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      res.json({ data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.changeStatus(req.params.id, req.body.status);
      res.json({ data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async getStatusCounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counts = await ticketService.getStatusCounts();
      res.json({ data: counts });
    } catch (error) {
      next(error);
    }
  }

  static async getResolvedByPeriod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawPeriod = req.query.period as string | undefined;
      if (rawPeriod && !VALID_PERIODS.includes(rawPeriod)) {
        throw new AppError(422, `Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
      }
      const period = (rawPeriod || 'month') as 'week' | 'month' | 'year';
      const count = await ticketService.getResolvedCountByPeriod(period);
      res.json({ data: { period, count } });
    } catch (error) {
      next(error);
    }
  }

  static async getResolvedCounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counts = await ticketService.getResolvedCountsAll();
      res.json({ data: counts });
    } catch (error) {
      next(error);
    }
  }
}
