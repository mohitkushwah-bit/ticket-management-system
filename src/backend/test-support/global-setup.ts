import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const TEST_DB = 'ticket_management_test';

function envOrDefault(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

function getDbConfig(database: string) {
  return {
    host: envOrDefault('DB_HOST', 'localhost'),
    port: parseInt(envOrDefault('DB_PORT', '5432'), 10),
    database,
    user: envOrDefault('DB_USER', 'postgres'),
    password: envOrDefault('DB_PASSWORD', 'postgres'),
  };
}

export default async function globalSetup(): Promise<void> {
  const pool = new Pool(getDbConfig('postgres'));

  // Create test database
  await pool.query(`DROP DATABASE IF EXISTS ${TEST_DB}`);
  await pool.query(`CREATE DATABASE ${TEST_DB}`);
  await pool.end();

  // Run migrations on test DB
  const testPool = new Pool(getDbConfig(TEST_DB));

  const migrationPath = path.join(__dirname, '../../../database/migrations/001_initial_schema.sql');
  const migration = fs.readFileSync(migrationPath, 'utf-8');
  await testPool.query(migration);

  // Seed test data
  const seedPath = path.join(__dirname, '../../../database/seeds/seed.sql');
  const seed = fs.readFileSync(seedPath, 'utf-8');
  await testPool.query(seed);

  await testPool.end();

  // Set env for tests (app reads these via config/env.ts)
  const config = getDbConfig(TEST_DB);
  process.env.DB_HOST = config.host;
  process.env.DB_PORT = String(config.port);
  process.env.DB_NAME = TEST_DB;
  process.env.DB_USER = config.user;
  process.env.DB_PASSWORD = config.password;
}
