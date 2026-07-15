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

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});
