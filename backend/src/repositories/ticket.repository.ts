import { pool } from '../config/database';
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
  TicketFilters,
  PaginatedResponse,
} from '../models/types';

export class TicketRepository {
  async findAll(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Allowed sort columns (whitelist to prevent SQL injection)
    const SORT_COLUMNS: Record<string, string> = {
      createdAt: 't.created_at',
      updatedAt: 't.updated_at',
      priority: 't.priority',
      title: 't.title',
    };

    const sortColumn = SORT_COLUMNS[filters.sortBy || 'createdAt'] || 't.created_at';
    const sortDirection = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.status) {
      conditions.push(`t.status = $${paramIndex++}`);
      params.push(filters.status);
    }

    if (filters.priority) {
      conditions.push(`t.priority = $${paramIndex++}`);
      params.push(filters.priority);
    }

    if (filters.assignedTo) {
      conditions.push(`t.assigned_to = $${paramIndex++}`);
      params.push(filters.assignedTo);
    }

    if (filters.search) {
      conditions.push(
        `(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`,
      );
      paramIndex++;
      params.push(`%${filters.search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const dataParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT t.id, t.title, t.description, t.priority, t.status,
              t.assigned_to AS "assignedTo", t.pr_link AS "prLink",
              t.created_by AS "createdBy",
              t.created_at AS "createdAt", t.updated_at AS "updatedAt",
              COUNT(*) OVER() AS "totalCount"
       FROM tickets t
       ${whereClause}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      dataParams,
    );

    const total = result.rows.length > 0 ? parseInt(result.rows[0].totalCount, 10) : 0;

    // Remove totalCount from each row
    const data = result.rows.map(({ totalCount: _, ...row }) => row as Ticket);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Ticket | null> {
    const result = await pool.query(
      `SELECT id, title, description, priority, status,
              assigned_to AS "assignedTo", pr_link AS "prLink",
              created_by AS "createdBy",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM tickets WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const result = await pool.query(
      `INSERT INTO tickets (title, description, priority, assigned_to, pr_link, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, priority, status,
                 assigned_to AS "assignedTo", pr_link AS "prLink",
                 created_by AS "createdBy",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [dto.title, dto.description, dto.priority, dto.assignedTo || null, dto.prLink || null, dto.createdBy],
    );
    return result.rows[0];
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket | null> {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (dto.title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      params.push(dto.title);
    }
    if (dto.description !== undefined) {
      setClauses.push(`description = $${paramIndex++}`);
      params.push(dto.description);
    }
    if (dto.priority !== undefined) {
      setClauses.push(`priority = $${paramIndex++}`);
      params.push(dto.priority);
    }
    if (dto.assignedTo !== undefined) {
      setClauses.push(`assigned_to = $${paramIndex++}`);
      params.push(dto.assignedTo);
    }
    if (dto.prLink !== undefined) {
      setClauses.push(`pr_link = $${paramIndex++}`);
      params.push(dto.prLink);
    }

    if (setClauses.length === 0) return this.findById(id);

    params.push(id);
    const result = await pool.query(
      `UPDATE tickets SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, title, description, priority, status,
                 assigned_to AS "assignedTo", pr_link AS "prLink",
                 created_by AS "createdBy",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      params,
    );
    return result.rows[0] || null;
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket | null> {
    const result = await pool.query(
      `UPDATE tickets SET status = $1
       WHERE id = $2
       RETURNING id, title, description, priority, status,
                 assigned_to AS "assignedTo", pr_link AS "prLink",
                 created_by AS "createdBy",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [status, id],
    );
    return result.rows[0] || null;
  }

  async updateStatusAtomic(
    id: string,
    expectedCurrentStatus: TicketStatus,
    newStatus: TicketStatus,
  ): Promise<Ticket | null> {
    const result = await pool.query(
      `UPDATE tickets SET status = $1
       WHERE id = $2 AND status = $3
       RETURNING id, title, description, priority, status,
                 assigned_to AS "assignedTo", pr_link AS "prLink",
                 created_by AS "createdBy",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [newStatus, id, expectedCurrentStatus],
    );
    return result.rows[0] || null;
  }

  async getStatusCounts(): Promise<Record<TicketStatus, number>> {
    const result = await pool.query(
      `SELECT status, COUNT(*)::int as count FROM tickets GROUP BY status`,
    );
    const counts: Record<string, number> = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      cancelled: 0,
    };
    for (const row of result.rows) {
      counts[row.status] = row.count;
    }
    return counts as Record<TicketStatus, number>;
  }

  async getResolvedCountByPeriod(
    period: 'week' | 'month' | 'year',
  ): Promise<number> {
    const intervals: Record<string, string> = {
      week: '7 days',
      month: '30 days',
      year: '365 days',
    };
    const interval = intervals[period];
    const result = await pool.query(
      `SELECT COUNT(*)::int as count FROM tickets
       WHERE status IN ('resolved', 'closed')
       AND updated_at >= NOW() - $1::interval`,
      [interval],
    );
    return result.rows[0].count;
  }

  async getResolvedCountsAll(): Promise<{ week: number; month: number; year: number }> {
    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE updated_at >= NOW() - INTERVAL '7 days')::int AS week,
         COUNT(*) FILTER (WHERE updated_at >= NOW() - INTERVAL '30 days')::int AS month,
         COUNT(*) FILTER (WHERE updated_at >= NOW() - INTERVAL '365 days')::int AS year
       FROM tickets
       WHERE status IN ('resolved', 'closed')`,
    );
    return result.rows[0];
  }
}
