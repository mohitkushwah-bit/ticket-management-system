import { pool } from '../config/database';
import { Role, RolePermissions } from '../models/types';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    const result = await pool.query(
      `SELECT id, name, description, permissions, created_at AS "createdAt" FROM roles ORDER BY name ASC`,
    );
    return result.rows;
  }

  async findById(id: string): Promise<Role | null> {
    const result = await pool.query(
      `SELECT id, name, description, permissions, created_at AS "createdAt" FROM roles WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async findByName(name: string): Promise<Role | null> {
    const result = await pool.query(
      `SELECT id, name, description, permissions, created_at AS "createdAt" FROM roles WHERE name = $1`,
      [name],
    );
    return result.rows[0] || null;
  }

  async create(name: string, description: string | null, permissions: RolePermissions): Promise<Role> {
    const result = await pool.query(
      `INSERT INTO roles (name, description, permissions) VALUES ($1, $2, $3)
       RETURNING id, name, description, permissions, created_at AS "createdAt"`,
      [name, description, JSON.stringify(permissions)],
    );
    return result.rows[0];
  }

  async update(id: string, data: { name?: string; description?: string; permissions?: RolePermissions }): Promise<Role | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.permissions !== undefined) {
      fields.push(`permissions = $${idx++}`);
      values.push(JSON.stringify(data.permissions));
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE roles SET ${fields.join(', ')} WHERE id = $${idx}
       RETURNING id, name, description, permissions, created_at AS "createdAt"`,
      values,
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM roles WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async countUsersByRole(roleId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS count FROM users WHERE role_id = $1',
      [roleId],
    );
    return result.rows[0].count;
  }
}
