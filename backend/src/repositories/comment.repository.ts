import { pool } from '../config/database';
import { Comment, CreateCommentDto } from '../models/types';

export class CommentRepository {
  async findByTicketId(ticketId: string): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT id, ticket_id AS "ticketId", message,
              created_by AS "createdBy", created_at AS "createdAt"
       FROM comments
       WHERE ticket_id = $1
       ORDER BY created_at ASC`,
      [ticketId],
    );
    return result.rows;
  }

  async create(ticketId: string, dto: CreateCommentDto): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (ticket_id, message, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, ticket_id AS "ticketId", message,
                 created_by AS "createdBy", created_at AS "createdAt"`,
      [ticketId, dto.message, dto.createdBy],
    );
    return result.rows[0];
  }
}
