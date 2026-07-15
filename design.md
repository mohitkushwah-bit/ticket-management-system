# Design Notes — Support Ticket Management System

Comprehensive architecture reference grounded in `src/backend/`, `src/frontend/`, `database/`, and `.copilot-sessions/` prompt history. For submission summary, see also [design-notes.md](design-notes.md).

---

## 1. System Overview

| Component | Path | Stack |
|-----------|------|-------|
| Frontend | `src/frontend/` | React 18, TypeScript, Vite |
| Backend | `src/backend/` | Node.js 20, Express, TypeScript |
| Database | `database/` | PostgreSQL 16 |
| Tests | `tests/backend/`, `tests/frontend/` | Jest, Vitest |
| Infrastructure | `docker-compose.yml` | Docker Compose (db, backend, frontend) |

Apps communicate only over HTTP. Each has its own `package.json`, `tsconfig.json`, and `.env`.

---

## 2. Architecture Decisions

### 2.1 Monorepo with Application Separation

**Decision:** `src/frontend/` and `src/backend/` with shared-nothing runtime.

**Rationale:** Prompt (2026-07-06): *"Create two folders one for frontend and one for backend"* with scalability NFR. Evolved to `src/` layout for submission structure.

**Evidence:** `docker-compose.yml` builds three services from `./src/backend` and `./src/frontend` contexts.

### 2.2 Backend Layered Architecture

```
HTTP → routes/ → controllers/ → services/ → repositories/ → PostgreSQL
```

**Evidence:**
- `src/backend/src/services/ticket.service.ts` — state machine + optimistic concurrency
- `src/backend/src/repositories/ticket.repository.ts` — parameterized SQL, `COUNT(*) OVER()`
- `src/backend/src/controllers/ticket.controller.ts` — thin handlers

**DI:** Optional repository injection in service constructors for testability.

### 2.3 Frontend Layered Architecture

```
User → pages/ → components/ → services/ → api.ts → Backend API
```

**Evidence:**
- `src/frontend/src/App.tsx` — lazy routes with `Suspense`
- `src/frontend/src/services/ticket.service.ts`, `auth.service.ts`
- `src/frontend/src/context/AuthContext.tsx`, `ToastContext.tsx`

### 2.4 Database Location

**Decision:** Top-level `database/` folder (submission layout).

**History:** Merged migrations (2026-07-10 11:54) → moved into `backend/database/` (11:57) → relocated to root `database/` for assessment structure.

**Evidence:**
- `database/migrations/001_initial_schema.sql`
- `database/seeds/seed.sql`
- `docker-compose.yml` volume mounts from `./database/`

---

## 3. Core Design: Status State Machine

### 3.1 Valid Transitions

```
open         → in_progress, cancelled
in_progress  → resolved, cancelled
resolved     → closed
closed       → (terminal)
cancelled    → (terminal)
```

### 3.2 Implementation

**Canonical module:** `src/backend/src/models/state-machine.ts`

```typescript
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};
```

**Service enforcement** (`ticket.service.ts`):
- `isValidTransition()` check → 422 with valid next statuses
- `updateStatusAtomic()` → 409 on race condition

**Frontend enforcement:**
- `TicketDetailPage` — transition buttons from `VALID_TRANSITIONS`
- `KanbanBoard` — client pre-check + API call; `KanbanPage.handleStatusChange` returns boolean for snap-back

**Tests:** `tests/backend/state-machine.test.ts` — 11 cases covering all valid/invalid paths.

---

## 4. Authentication & Authorization

### 4.1 JWT Authentication

Built per prompt (2026-07-08): login, encrypted password, logout, profile screen.

| Step | Implementation |
|------|----------------|
| Login | `POST /api/auth/login` → JWT |
| Middleware | `src/backend/src/middleware/auth.ts` |
| Frontend storage | `localStorage` token via `AuthContext` |
| Interceptor | `src/frontend/src/services/api.ts` attaches Bearer header |
| 401 handling | Clear auth, redirect `/login` |

### 4.2 Role-Based Access Control

Built per prompts (2026-07-09): roles table, user CRUD, checkbox permissions matrix.

| Role | Ticket write | Admin screens |
|------|-------------|---------------|
| admin | Yes | Yes (users, roles) |
| user | Yes | No |
| agent | No (read-only) | No |

**Backend:** `authorize('admin', 'user')` on ticket write routes in `ticket.routes.ts`  
**Frontend:** `WriterRoute` (create/edit), `AdminRoute` (users/roles), `useRole().canWrite`

**Permissions JSONB:** Per-screen `{ read, write }` in `roles.permissions` — editable via `RoleFormModal`.

---

## 5. Data Model

See [data-model.md](data-model.md) for full schema. Key entities: Role, User, Ticket, Comment.

- UUID PKs throughout
- `ticket_priority`, `ticket_status` PostgreSQL enums
- `pr_link VARCHAR(2048)` — added 2026-07-06
- `pg_trgm` + `ILIKE` for partial search — fixed 2026-07-07

---

## 6. API Design

### 6.1 REST Conventions

- `/api/tickets`, `/api/users`, `/api/roles`, `/api/auth`
- `PATCH /api/tickets/:id/status` for state machine
- Nested comments: `/api/tickets/:id/comments`
- Stats: `/api/tickets/stats/status-counts`, `/stats/resolved-all`

### 6.2 Validation

Zod in `src/backend/src/routes/validation-schemas.ts` → `validate` middleware → 400/422.

### 6.3 Pagination & Filtering

`GET /api/tickets` supports `search`, `status`, `priority`, `assignee`, `page`, `limit`, `sortBy`, `sortOrder`.

Added per prompt (2026-07-07): filter by priority and assignee, sorting, pagination.

**Query optimization (2026-07-10):** `COUNT(*) OVER()` in `ticket.repository.ts` `findAll()`.

### 6.4 Swagger

`src/backend/src/config/swagger.ts` — prompt 2026-07-10 11:29. UI at `/api-docs` (non-production).

---

## 7. Security Design

Hardened in session 2026-07-10 (14:41–14:51):

| Concern | Implementation | File |
|---------|---------------|------|
| HTTP headers | `helmet()` | `src/backend/src/app.ts` |
| CORS | `ALLOWED_ORIGINS` env | `src/backend/src/app.ts` |
| Body limit | `10kb` | `src/backend/src/app.ts` |
| Rate limiting | `express-rate-limit` | `src/backend/src/app.ts` |
| Passwords | bcrypt `$2b$12$` | `auth.service.ts` |
| SQL injection | Parameterized queries | all `repositories/` |
| Secrets | `config/env.ts` | `.env.example` placeholders |
| Swagger | Production disabled | `src/backend/src/app.ts` |

**Rejected:** Dummy hash timing attack mitigation (14:53–14:56).

---

## 8. Frontend Design System

### 8.1 CSS Variables

`src/frontend/src/styles/variables.css` — slate/blue primary, semantic status colors, spacing/typography scales.

### 8.2 Common Components

Prompt (2026-07-06): *"create common controls for repetitive frontend UI"* → `components/common/`.

### 8.3 Performance (2026-07-10 optimization sessions)

| Pattern | Location |
|---------|----------|
| `React.lazy` + `Suspense` | `App.tsx` |
| `useMemo` / `useCallback` | Contexts, KanbanBoard, SearchFilter, TicketDetailPage |
| `React.memo` | `KanbanColumn.tsx` |
| Debounced search (300ms) | `SearchFilter.tsx` (13:52 prompt) |
| Consolidated dashboard stats | `DashboardPage` + `getResolvedCountsAll()` |

---

## 9. Testing Design

| Suite | Path | Cases |
|-------|------|-------|
| State machine | `tests/backend/state-machine.test.ts` | 11 |
| Tickets | `tests/backend/tickets.test.ts` | 19 |
| Comments | `tests/backend/comments.test.ts` | 6 |
| Users | `tests/backend/users.test.ts` | 24 |
| Roles | `tests/backend/roles.test.ts` | 20 |
| Frontend | `tests/frontend/EditTicketPage.test.tsx` | 1 |

Setup: `tests/backend/global-setup.ts` creates `ticket_management_test` DB from `database/` scripts.

---

## 10. Infrastructure

Docker Compose: PostgreSQL 16 (healthcheck) → backend :3001 → frontend :5173.  
Env files: `src/backend/.env`, `src/frontend/.env` via `env_file` directive.

---

## 11. Key Trade-offs

| Decision | Chosen | Alternative | Why |
|----------|--------|-------------|-----|
| Auth | JWT stateless | Server sessions | SPA + API separation |
| State machine | Service module | DB triggers only | Testable, clear 422 messages |
| RBAC | JSONB permissions | Hardcoded only | Admin can edit role access without code change |
| Search | ILIKE + trgm | Full-text only | Partial substring match requirement |
| Tests | Integration-heavy | Full E2E | Faster feedback on business rules |
| DB location | Top-level `database/` | Inside backend | Submission structure |

---

## 12. Traceability

```
requirements-analysis.md (state machine, Kanban, PR link)
  → src/backend/src/models/state-machine.ts
  → src/backend/src/services/ticket.service.ts
  → tests/backend/state-machine.test.ts
  → src/frontend/src/components/KanbanBoard.tsx
  → src/frontend/src/pages/TicketDetailPage.tsx
```
