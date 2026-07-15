import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DB = 'ticket_management_test';

export default async function globalSetup(): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  // Create test database
  await pool.query(`DROP DATABASE IF EXISTS ${TEST_DB}`);
  await pool.query(`CREATE DATABASE ${TEST_DB}`);
  await pool.end();

  // Run migrations on test DB
  const testPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: TEST_DB,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  const migrationPath = path.join(__dirname, '../database/migrations/001_initial_schema.sql');
  const migration = fs.readFileSync(migrationPath, 'utf-8');
  await testPool.query(migration);

  // Seed test data
  const seedPath = path.join(__dirname, '../database/seeds/seed.sql');
  const seed = fs.readFileSync(seedPath, 'utf-8');
  await testPool.query(seed);

  await testPool.end();

  // Set env for tests
  process.env.DB_NAME = TEST_DB;
}
