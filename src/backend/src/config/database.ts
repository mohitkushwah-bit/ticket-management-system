import { Pool } from 'pg';

import { env } from './env';

export const pool = new Pool({
  host: env.db.host,
  port: Number(env.db.port),
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isShuttingDown = false;

pool.on('error', (err) => {
  // Ignore expected errors when the test runner drops the database
  const pgErr = err as { code?: string };
  if (isShuttingDown || pgErr.code === '57P01') {
    return;
  }
  console.error('Unexpected database pool error:', err);
});

export async function closePool(): Promise<void> {
  isShuttingDown = true;
  await pool.end();
}
