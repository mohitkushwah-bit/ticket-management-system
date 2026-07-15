# Database Setup Notes

## Overview

PostgreSQL 16 database for the Ticket Management System. Schema and seed data live in this `database/` folder per submission structure.

## Files

| Path | Purpose |
|------|---------|
| `migrations/001_initial_schema.sql` | Tables, enums, indexes, roles, extensions (`pg_trgm`) |
| `seeds/seed.sql` | Sample users, tickets, comments for development/demo |
| `init.sql` | Reference init script for manual setup |

## Docker (Recommended)

From repository root:

```bash
docker-compose up db -d
```

Docker mounts:
- `database/migrations/001_initial_schema.sql` → `/docker-entrypoint-initdb.d/01-schema.sql`
- `database/seeds/seed.sql` → `/docker-entrypoint-initdb.d/02-seed.sql`

Schema and seed run automatically on first container start.

## Environment Variables

Set in root `.env` or `src/backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host (`db` in Docker Compose) |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `ticket_management` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |

## Manual Setup

```bash
createdb ticket_management
psql -d ticket_management -f database/migrations/001_initial_schema.sql
psql -d ticket_management -f database/seeds/seed.sql
```

## Test Database

Integration tests use a separate database `ticket_management_test`, created and dropped by `tests/backend/global-setup.ts` and `global-teardown.ts`.

## Seed Credentials

Seed users use bcrypt-hashed passwords (see `seeds/seed.sql`). Use documented test accounts from README — never use real credentials.
