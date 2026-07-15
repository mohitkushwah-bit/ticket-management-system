import { Request, Response, NextFunction } from 'express';

import { CommentService } from '../services/comment.service';

const commentService = new CommentService();

export class CommentController {
  static async getByTicketId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await commentService.getCommentsByTicketId(req.params.id);
      res.json({ data: comments });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.addComment(req.params.id, {
        ...req.body,
        createdBy: req.user!.userId,
      });
      res.status(201).json({ data: comment });
    } catch (error) {
      next(error);
    }
  }
}
