# PR Description

## Summary

Full-stack Ticket Management System: React SPA + Express API + PostgreSQL with JWT auth, database-driven RBAC, Kanban board, and mandatory state-machine integration tests. Repository follows AI practical assessment submission layout (`src/`, `tests/`, `database/`).

Built primarily with GitHub Copilot (Claude) across 5 development sessions (2026-07-06 → 2026-07-10), documented in `.copilot-sessions/`.

## Features Implemented

### Core
- Ticket CRUD (create, list, detail, edit) with `pr_link` field
- Status state machine enforced in API and UI
- Comments on tickets (append-only)
- Keyword search (partial match via `ILIKE`), status/priority/assignee filters
- Pagination and 7 sort options on ticket list
- Kanban drag-and-drop with invalid transition snap-back

### Stretch
- JWT login/logout + profile update (`LoginPage`, `ProfilePage`)
- Role-based access: admin (full), user (write tickets), agent (read-only)
- User and role CRUD with JSONB screen permissions matrix
- Dashboard with status counts and resolved tickets by week/month/year
- Swagger API docs at `/api-docs` (non-production)
- Docker Compose full stack

## Technical Changes

### Repository structure
```
src/frontend/     # React 18 + Vite (10 pages, common component library)
src/backend/      # Express + TypeScript (31 source files, layered architecture)
tests/backend/    # 5 Jest suites, ~80 test cases
tests/frontend/   # EditTicketPage component test
database/         # Consolidated migration + seed data
```

### Backend (`src/backend/src/`)
- Controller → Service → Repository pattern
- `models/state-machine.ts` — canonical transition rules
- `services/ticket.service.ts` — 422 on invalid transition, 409 on concurrent update
- Zod validation via `routes/validation-schemas.ts`
- Security: helmet, CORS, rate limit, 10kb body limit (session 2026-07-10)

### Frontend (`src/frontend/src/`)
- Lazy-loaded routes (`App.tsx`)
- `AuthContext` + JWT interceptor (`api.ts`)
- Route guards: `ProtectedRoute`, `AdminRoute`, `WriterRoute`
- `error-utils.ts` — backend validation messages in toasts
- `SearchFilter` — 300ms debounced search
- `@dnd-kit` Kanban board

## Database Changes

- **Migration:** `database/migrations/001_initial_schema.sql` (merged 2026-07-10)
  - Tables: `roles`, `users`, `tickets`, `comments`
  - Enums: `ticket_priority`, `ticket_status`
  - Extension: `pg_trgm` for search
  - 12 indexes including trigram GIN and composite status+updated
- **Seed:** `database/seeds/seed.sql` — 5 users, 6 tickets, comments
- **Trigger:** `update_updated_at_column()` on users and tickets

## Testing Done

| Suite | File | Cases | Coverage |
|-------|------|-------|----------|
| State machine | `tests/backend/state-machine.test.ts` | 11 | All valid/invalid transitions |
| Tickets | `tests/backend/tickets.test.ts` | 19 | CRUD, search, filter, pagination |
| Comments | `tests/backend/comments.test.ts` | 6 | Create, list, validation |
| Users | `tests/backend/users.test.ts` | 24 | Admin CRUD |
| Roles | `tests/backend/roles.test.ts` | 20 | Admin CRUD + permissions |
| Frontend | `tests/frontend/EditTicketPage.test.tsx` | 1 | Form prefill + submit |

**Commands:**
```bash
cd src/backend && npm run test:integration
cd src/frontend && npm test
```

## AI Usage Summary

| Session | Key work |
|---------|----------|
| 07-06 | Copilot setup, requirements, plan, Docker, common components |
| 07-07 | Edit ticket, filters/pagination, search fix, toast errors |
| 07-08 | JWT authentication + profile |
| 07-09 | Roles, users, RBAC both sides |
| 07-10 | Swagger, security audit, optimization, tests, cleanup |

See `tool-workflow.md`, `final-ai-usage-summary.md`, and `ai-prompts/`.

## Screenshots / Demo Notes

See `screenshots.pdf` in repository root.

**Seed credentials** (`database/seeds/seed.sql`):
- `alice@example.com` (admin)
- `bob@example.com` (agent)
- `charlie@example.com` (user)
- Password: `password123` (synthetic test accounts only)

## Known Limitations

- No GitHub Actions CI pipeline
- Frontend test coverage: 1 component test only
- JWT has no refresh token flow
- Kanban loads max 100 tickets (`limit: 100` in `KanbanPage`)

## Future Improvements

- CI/CD (lint, test, build on push)
- E2E tests for Kanban drag-and-drop
- Shared user list cache to avoid repeated `userService.getAll()` calls
- Token refresh for long sessions
