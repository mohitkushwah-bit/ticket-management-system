# Design Notes

Architecture and design decisions grounded in the implemented codebase (`src/backend/`, `src/frontend/`) and prompt history in `.copilot-sessions/`.

## Architecture Overview (frontend, backend, database)

```
┌──────────────────────┐   HTTP/REST + JWT   ┌──────────────────────┐   SQL/pg   ┌─────────────────┐
│   src/frontend/      │ ◄─────────────────► │   src/backend/       │ ◄────────► │   PostgreSQL    │
│   React 18 + Vite    │                     │   Express + TS       │            │   database/     │
└──────────────────────┘                     └──────────────────────┘            └─────────────────┘
         │                                              │
         └──────────── tests/frontend/ ─────────────────┴──── tests/backend/ ───┘
```

| Layer | Location | Key technologies |
|-------|----------|------------------|
| Frontend | `src/frontend/` | React 18, TypeScript, Vite, React Router v6, @dnd-kit, Axios |
| Backend | `src/backend/` | Node.js 20, Express, TypeScript, Zod, pg, JWT, bcrypt |
| Database | `database/` | PostgreSQL 16, enums, JSONB, pg_trgm, triggers |
| Tests | `tests/` | Jest + Supertest (backend), Vitest + RTL (frontend) |
| Infra | `docker-compose.yml` | db + backend + frontend services |

## Frontend Design

**Pattern:** Pages → Components → Services → `api.ts`

| Concern | Implementation |
|---------|----------------|
| Routing | `src/frontend/src/App.tsx` — 10 pages, lazy-loaded except Login/Dashboard |
| Auth state | `AuthContext.tsx` — JWT in localStorage, user profile from `/auth/me` |
| Notifications | `ToastContext.tsx` — success/error toasts (replaced banner errors per 2026-07-07 fix) |
| Route guards | `ProtectedRoute`, `AdminRoute`, `WriterRoute` |
| RBAC hook | `useRole()` — `canWrite` for admin/user; agent read-only |
| Design system | `components/common/` — Button, Input, TextArea, Select, Card, Badge, Toast, LoadingSpinner |
| Styling | CSS variables in `styles/variables.css` (per 2026-07-06 NFR prompt) |
| Kanban | `KanbanBoard.tsx` — @dnd-kit, `VALID_TRANSITIONS` client-side pre-check |
| Search/filter | `SearchFilter.tsx` — 300ms debounce, status/priority/assignee/sort controls |

**Pages implemented:** Dashboard, TicketList, TicketDetail, CreateTicket, EditTicket, Kanban, Login, Profile, Users, Roles.

## Backend Design

**Pattern:** Routes → Controllers → Services → Repositories → PostgreSQL

```
src/backend/src/
├── routes/           # Express routers + Zod schemas (validation-schemas.ts)
├── controllers/    # HTTP mapping (ticket, comment, auth, user, role)
├── services/         # Business logic (state machine in ticket.service.ts)
├── repositories/     # Parameterized SQL (ticket, comment, user, role)
├── middleware/       # auth, authorize, validate, error-handler
├── models/           # state-machine.ts, types.ts
└── config/           # env.ts, database.ts, swagger.ts
```

**Key decisions:**
- Injectable repositories via optional constructor params (no DI framework)
- Status changes on dedicated `PATCH /api/tickets/:id/status` endpoint
- `authorize('admin', 'user')` on write routes — agent is read-only for tickets
- Swagger at `/api-docs` only when `NODE_ENV !== 'production'`

## Database Design

- Single consolidated migration: `database/migrations/001_initial_schema.sql`
- Roles with JSONB permissions (added 2026-07-09)
- Users reference `role_id` FK (migrated from enum column)
- Ticket enums enforced at DB level
- `update_updated_at_column()` trigger on users and tickets
- Search: `ILIKE` + trigram GIN indexes + tsvector index

## Validation Strategy

| Layer | Mechanism |
|-------|-----------|
| API input | Zod schemas in `validation-schemas.ts` via `validate` middleware |
| State machine | `isValidTransition()` in service before DB write |
| PR link | Zod `.url()` — rejects `"https:// github.com/local"` (spaces) |
| Frontend forms | Required field checks + API error display via `getApiErrorMessage()` |

## Error Handling Strategy

- Backend: `AppError` class + `error-handler` middleware → `{ errors: [{ message, field?, code? }] }`
- Frontend: `error-utils.ts` extracts messages; `showToast('error', ...)` on all pages
- 401: Axios interceptor clears auth, redirects `/login`
- 422 state machine: message includes valid next statuses
- 409: optimistic concurrency on concurrent status updates
- Kanban: `handleStatusChange` returns `false` → card snaps back

## Testing Strategy Link

See [test-strategy.md](test-strategy.md). Mandatory state-machine tests in `tests/backend/state-machine.test.ts` (11 cases). Total backend integration tests: ~80 `it()` blocks across 5 suites.

## Traceability (prompt → code)

| Prompt (date) | Design outcome |
|---------------|----------------|
| 2026-07-06: Kanban + PR link + integration tests | `KanbanBoard.tsx`, `pr_link` column, `tests/backend/` |
| 2026-07-06: Chunked plan (user → ticket → comment → kanban → dashboard) | Phased pages and services |
| 2026-07-08: Login + JWT + profile | `auth.service.ts`, `LoginPage`, `ProfilePage`, `api.ts` interceptors |
| 2026-07-09: Roles + RBAC both sides | `roles` table, `authorize` middleware, route guards |
| 2026-07-10: Swagger, security, optimization | `swagger.ts`, `helmet`/CORS/rate-limit, memoization |
| 2026-07-15: Submission restructure | `src/`, `tests/`, `database/` layout |
