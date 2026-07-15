import { Pool } from 'pg';

const TEST_DB = 'ticket_management_test';

export default async function globalTeardown(): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  // Terminate active connections before dropping
  await pool.query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = '${TEST_DB}' AND pid <> pg_backend_pid()
  `);

  await pool.query(`DROP DATABASE IF EXISTS ${TEST_DB}`);
  await pool.end();
}
