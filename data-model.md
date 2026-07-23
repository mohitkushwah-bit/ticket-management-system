# Data Model

Grounded in `database/migrations/001_initial_schema.sql`, `database/seeds/seed.sql`, and TypeScript types in `src/backend/src/models/types.ts`.

## Entity Relationship

```
Role 1──* User 1──* Ticket (created_by)
              User 0..1──* Ticket (assigned_to)
              User 1──* Comment *──1 Ticket
```

## Role

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, `gen_random_uuid()` |
| name | VARCHAR(50) | Unique, required |
| description | VARCHAR(255) | Nullable |
| permissions | JSONB | Required; screen-level read/write matrix |
| created_at | TIMESTAMPTZ | Default `NOW()` |

**Default roles** (seeded in migration): `admin`, `agent`, `user`

**Permissions structure** (per screen: `dashboard`, `tickets`, `kanban`, `users`, `roles`):

```json
{ "read": true, "write": false }
```

Added per prompt (2026-07-09): `/build-feature Create Roles & User screens` with checkbox matrix for read/write per screen.

## User

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Unique, required |
| password_hash | VARCHAR(255) | Required; bcrypt (`$2b$12$...`) |
| role_id | UUID | FK → `roles.id`, required |
| created_at | TIMESTAMPTZ | Default `NOW()` |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**Migration note (2026-07-09):** Prompt `User table should have role_id instead of role column` — enum column replaced with FK to `roles` table.

**Seed users** (`database/seeds/seed.sql`): Alice (admin), Bob/Diana (agent), Charlie/Eve (user). Password placeholder: `password123` (bcrypt hash in seed file).

## Ticket

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| title | VARCHAR(255) | Required |
| description | TEXT | Required |
| priority | `ticket_priority` enum | `low`, `medium`, `high`, `critical`; default `medium` |
| status | `ticket_status` enum | `open`, `in_progress`, `resolved`, `closed`, `cancelled`; default `open` |
| assigned_to | UUID | FK → `users.id`, `ON DELETE SET NULL`, nullable |
| pr_link | VARCHAR(2048) | Nullable; Zod URL validation when provided |
| created_by | UUID | FK → `users.id`, `ON DELETE RESTRICT`, required |
| created_at | TIMESTAMPTZ | Default `NOW()` |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**Added per prompt (2026-07-06):** PR link field on ticket entity.

## Comment

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| ticket_id | UUID | FK → `tickets.id`, `ON DELETE CASCADE`, required |
| message | TEXT | Required |
| created_by | UUID | FK → `users.id`, `ON DELETE RESTRICT`, required |
| created_at | TIMESTAMPTZ | Default `NOW()` |

Comments are append-only in current implementation (no edit/delete endpoints).

## PostgreSQL Enums

```sql
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'cancelled');
```

## Indexes

| Index | Purpose |
|-------|---------|
| `idx_tickets_status`, `idx_tickets_priority` | Filter queries |
| `idx_tickets_assigned_to`, `idx_tickets_created_by` | FK lookups |
| `idx_tickets_created_at`, `idx_tickets_updated_at` | Sorting |
| `idx_tickets_status_updated` | Composite filter + sort |
| `idx_tickets_title_trgm`, `idx_tickets_description_trgm` | Partial keyword search (`pg_trgm`) |
| `idx_tickets_search` | Full-text `to_tsvector` on title + description |
| `idx_comments_ticket_id` | Comment list by ticket |

**Search fix (2026-07-07):** Prompt reported full-word-only search; fixed with `ILIKE '%term%'` in `ticket.repository.ts` plus trigram GIN indexes.

## Status State Machine

```
open         → in_progress, cancelled
in_progress  → resolved, cancelled
resolved     → closed
closed       → (terminal)
cancelled    → (terminal)
```

**Enforcement layers:**
1. **Application:** `src/backend/src/models/state-machine.ts` → `ticket.service.ts`
2. **Database:** `database/migrations/002_status_transition_trigger.sql` — `BEFORE UPDATE` trigger rejects invalid transitions at the schema layer

## Schema & Seed Locations

| Artifact | Path |
|----------|------|
| Initial migration | `database/migrations/001_initial_schema.sql` |
| Status transition trigger | `database/migrations/002_status_transition_trigger.sql` |
| Seed data | `database/seeds/seed.sql` |
| Setup notes | `database/setup-notes.md` |
| TypeScript types | `src/backend/src/models/types.ts` |

**Evolution:** Migrations merged (2026-07-10), briefly moved to `backend/database/`, then relocated to top-level `database/` for submission layout.
