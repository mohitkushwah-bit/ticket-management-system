import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as path from 'path';

import { closePool } from '../src/config/database';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const TEST_DB = 'ticket_management_test';

function envOrDefault(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

export default async function globalTeardown(): Promise<void> {
  await closePool();

  const pool = new Pool({
    host: envOrDefault('DB_HOST', 'localhost'),
    port: parseInt(envOrDefault('DB_PORT', '5432'), 10),
    database: 'postgres',
    user: envOrDefault('DB_USER', 'postgres'),
    password: envOrDefault('DB_PASSWORD', 'postgres'),
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
