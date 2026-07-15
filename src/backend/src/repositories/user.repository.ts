import { pool } from '../config/database';
import { User } from '../models/types';

const USER_SELECT = `
  u.id, u.name, u.email, u.role_id AS "roleId",
  r.name AS role,
  u.created_at AS "createdAt", u.updated_at AS "updatedAt"
`;

const USER_FROM = `users u JOIN roles r ON r.id = u.role_id`;

export class UserRepository {
  async findAll(): Promise<User[]> {
    const result = await pool.query(
      `SELECT ${USER_SELECT} FROM ${USER_FROM} ORDER BY u.name ASC`,
    );
    return result.rows;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT ${USER_SELECT} FROM ${USER_FROM} WHERE u.id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT ${USER_SELECT} FROM ${USER_FROM} WHERE u.email = $1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async findByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const result = await pool.query(
      `SELECT ${USER_SELECT}, u.password_hash AS "passwordHash" FROM ${USER_FROM} WHERE u.email = $1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async getPasswordHash(userId: string): Promise<string | null> {
    const result = await pool.query(
      `SELECT password_hash AS "passwordHash" FROM users WHERE id = $1`,
      [userId],
    );
    return result.rows[0]?.passwordHash || null;
  }

  async create(name: string, email: string, passwordHash: string, roleId: string): Promise<User> {
    const result = await pool.query(
      `WITH inserted AS (
         INSERT INTO users (name, email, password_hash, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *
       )
       SELECT inserted.id, inserted.name, inserted.email,
              inserted.role_id AS "roleId", r.name AS role,
              inserted.created_at AS "createdAt", inserted.updated_at AS "updatedAt"
       FROM inserted JOIN roles r ON r.id = inserted.role_id`,
      [name, email, passwordHash, roleId],
    );
    return result.rows[0];
  }

  async update(id: string, fields: { name?: string; email?: string; roleId?: string; passwordHash?: string }): Promise<User | null> {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (fields.name !== undefined) {
      setClauses.push(`name = $${paramIndex++}`);
      params.push(fields.name);
    }
    if (fields.email !== undefined) {
      setClauses.push(`email = $${paramIndex++}`);
      params.push(fields.email);
    }
    if (fields.roleId !== undefined) {
      setClauses.push(`role_id = $${paramIndex++}`);
      params.push(fields.roleId);
    }
    if (fields.passwordHash !== undefined) {
      setClauses.push(`password_hash = $${paramIndex++}`);
      params.push(fields.passwordHash);
    }

    if (setClauses.length === 0) return this.findById(id);

    setClauses.push(`updated_at = NOW()`);
    params.push(id);

    const result = await pool.query(
      `WITH updated AS (
         UPDATE users SET ${setClauses.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *
       )
       SELECT updated.id, updated.name, updated.email,
              updated.role_id AS "roleId", r.name AS role,
              updated.created_at AS "createdAt", updated.updated_at AS "updatedAt"
       FROM updated JOIN roles r ON r.id = updated.role_id`,
      params,
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async countTicketsByUser(userId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS count FROM tickets WHERE created_by = $1',
      [userId],
    );
    return result.rows[0].count;
  }
}
