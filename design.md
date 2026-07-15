# Design Notes — Support Ticket Management System

Architecture and design decisions for this project, grounded in the implemented codebase and `tool-specific/other-tool-workflow/requirements.md`.

---

## 1. System Overview

A full-stack internal support ticket application with:

- **Frontend:** React 18 + TypeScript + Vite (`frontend/`)
- **Backend:** Node.js + Express + TypeScript (`backend/`)
- **Database:** PostgreSQL 16 (`backend/database/`)
- **Infrastructure:** Docker Compose (`docker-compose.yml`)

The frontend and backend are independent applications communicating only over HTTP. Each has its own `package.json`, `tsconfig.json`, and `.env` configuration.

---

## 2. Architecture Decisions

### 2.1 Monorepo with Application Separation

**Decision:** Two top-level app folders (`frontend/`, `backend/`) with shared-nothing runtime.

**Rationale:** Clear ownership boundaries, independent deployability, and alignment with `tool-specific/other-tool-workflow/requirements.md` non-functional requirements.

**Evidence:** `docker-compose.yml` builds and runs three services (`db`, `backend`, `frontend`) from separate contexts.

### 2.2 Backend Layered Architecture

**Decision:** Controller → Service → Repository pattern.

```
HTTP Request
  → routes/          (routing + Zod validation schemas)
  → controllers/     (request/response mapping)
  → services/        (business logic)
  → repositories/    (SQL via pg)
  → PostgreSQL
```

**Rationale:** Separates framework concerns from business logic and enables unit/integration testing at the service layer with injectable repositories.

**Evidence:**
- `backend/src/services/ticket.service.ts` — state machine enforcement in service layer
- `backend/src/repositories/ticket.repository.ts` — parameterized SQL queries
- `backend/src/controllers/ticket.controller.ts` — thin HTTP handlers

**Dependency injection:** Services accept optional repository instances in constructors (e.g., `TicketService(ticketRepository?)`), supporting testability without a DI framework.

### 2.3 Frontend Layered Architecture

**Decision:** Pages → Components → Services → API.

```
User Interaction
  → pages/           (route-level views)
  → components/      (reusable UI, including common/ design system)
  → services/        (API client modules per domain)
  → api.ts           (Axios instance with JWT interceptors)
  → Backend REST API
```

**Evidence:**
- `frontend/src/App.tsx` — route definitions with lazy-loaded pages
- `frontend/src/services/ticket.service.ts`, `auth.service.ts` — domain API wrappers
- `frontend/src/context/AuthContext.tsx`, `ToastContext.tsx` — cross-cutting state

### 2.4 Database Location

**Decision:** Database scripts live inside `backend/database/` (not a top-level `database/` folder).

**Rationale:** Co-locates schema with the API that owns it. Evolved during development — session log shows a prompt at 11:57 to move the database folder into backend, followed by path updates across the project.

**Evidence:**
- `backend/database/migrations/001_initial_schema.sql`
- `backend/database/seeds/seed.sql`
- `docker-compose.yml` mounts migrations from `./backend/database/`

---

## 3. Core Design: Status State Machine

The state machine is the signature business rule of this system.

### 3.1 Valid Transitions

```
Open         → In Progress, Cancelled
In Progress  → Resolved, Cancelled
Resolved     → Closed
Closed       → (terminal)
Cancelled    → (terminal)
```

### 3.2 Implementation Strategy

**Decision:** Single source of truth in `backend/src/models/state-machine.ts`, enforced in the service layer, validated by integration tests.

```typescript
// backend/src/models/state-machine.ts
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};
```

**Service enforcement** (`ticket.service.ts`):
- Calls `isValidTransition()` before updating
- Returns HTTP 422 with valid-next-statuses message on invalid transition
- Uses `updateStatusAtomic()` with optimistic concurrency (409 on race condition)

**Frontend enforcement:**
- `TicketDetailPage` — shows only valid transition buttons via `getValidTransitions()`
- `KanbanBoard` — drag-and-drop calls status API; invalid drops rejected with toast and card snap-back

**Test evidence:** `backend/tests/state-machine.test.ts` — all valid transitions pass, all invalid transitions return 400/422.

---

## 4. Authentication & Authorization

### 4.1 JWT Authentication

**Decision:** Stateless JWT bearer tokens, not server-side sessions.

**Backend flow:**
1. `POST /api/auth/login` — validates credentials, returns JWT
2. `authenticate` middleware (`backend/src/middleware/auth.ts`) — verifies token on protected routes
3. `authorize` middleware — checks role permissions per endpoint

**Frontend flow:**
1. Login stores token in `localStorage`
2. `api.ts` Axios interceptor attaches `Authorization: Bearer <token>`
3. 401 responses clear auth state and redirect to `/login`
4. `ProtectedRoute`, `AdminRoute`, `WriterRoute` guard frontend routes

### 4.2 Role-Based Access Control (RBAC)

**Decision:** Database-driven roles with JSONB permissions matrix, not hardcoded role checks only.

**Schema** (`001_initial_schema.sql`):
- `roles` table with `permissions JSONB` per screen (`dashboard`, `tickets`, `kanban`, `users`, `roles`)
- Default roles: `admin`, `agent`, `user`

**Frontend:** `useRole` hook reads permissions from auth context; route guards enforce screen-level access.

**Backend:** `authorize` middleware checks role name against allowed roles per route.

---

## 5. Data Model

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| **Role** | id, name, permissions (JSONB) | Stretch feature — full CRUD UI |
| **User** | id, name, email, password_hash, role_id | bcrypt password hashing |
| **Ticket** | id, title, description, priority, status, assigned_to, pr_link, created_by | UUID PKs, enum types |
| **Comment** | id, ticket_id, message, created_by | Immutable in core scope |

**PostgreSQL enums:** `ticket_priority`, `ticket_status` — enforced at DB level.

**Search optimization:** `pg_trgm` extension enabled for trigram-based keyword search on ticket title/description.

**Indexing:** Status and priority columns indexed for filter queries (see migration file).

---

## 6. API Design

### 6.1 REST Conventions

- Plural nouns: `/api/tickets`, `/api/users`, `/api/roles`
- Status changes on dedicated endpoint: `PATCH /api/tickets/:id/status`
- Comments nested under tickets: `/api/tickets/:id/comments`
- Consistent error format: `{ errors: [{ message, field? }] }`

### 6.2 Validation

**Decision:** Zod schemas in `backend/src/routes/validation-schemas.ts`, applied via `validate` middleware.

Validates request body/query before reaching controllers. Returns 400/422 with structured field errors.

### 6.3 Pagination & Filtering

`GET /api/tickets` supports:
- `?search=` — keyword (title + description)
- `?status=` — status filter
- `?priority=` — priority filter
- `?page=` / `?limit=` — pagination
- `?sortBy=` / `?sortOrder=` — sorting

**Query optimization:** `findAll` uses `COUNT(*) OVER()` window function to return total count in a single query (applied during optimization session at 13:58–14:07).

### 6.4 API Documentation

Swagger UI at `/api-docs` (non-production only), configured in `backend/src/config/swagger.ts`. Added per session prompt at 11:29.

---

## 7. Security Design

| Concern | Implementation | Evidence |
|---------|---------------|----------|
| HTTP headers | `helmet()` | `backend/src/app.ts` |
| CORS | Configurable via `ALLOWED_ORIGINS` env | `backend/src/app.ts` |
| Body size limit | `express.json({ limit: '10kb' })` | `backend/src/app.ts` |
| Rate limiting | `express-rate-limit` | `backend/package.json` |
| Password storage | bcrypt hashing | `backend/src/services/auth.service.ts` |
| SQL injection | Parameterized queries only | All `repositories/` files |
| Secrets | Environment variables via `config/env.ts` | `.env.example` placeholders |
| Swagger exposure | Disabled in production | `backend/src/app.ts` |

Security hardening was driven by a dedicated session (14:41–14:51) using `/find-bugs` and explicit security audit prompts.

---

## 8. Frontend Design System

### 8.1 CSS Variables

**Decision:** Token-based design system in `frontend/src/styles/variables.css`.

- Primary palette: slate/blue (`--color-primary: #3b82f6`)
- Semantic status colors per ticket state
- Spacing scale: `--space-xs` through `--space-2xl`
- Typography scale: `--font-size-xs` through `--font-size-3xl`

Enforced by `.github/instructions/design-system.instructions.md` (auto-applied to `*.tsx`, `*.css`).

### 8.2 Component Library

Reusable primitives in `frontend/src/components/common/`:
- `Button`, `Input`, `TextArea`, `Select`, `Card`, `Badge`, `Toast`, `LoadingSpinner`

Feature components: `KanbanBoard`, `TicketForm`, `SearchFilter`, `CommentList`, `StatusBadge`.

### 8.3 Performance Patterns

Applied during optimization sessions (documented in `.copilot-sessions/prompts_2026-07-10.log`):

| Pattern | Where |
|---------|-------|
| `React.lazy` + `Suspense` | `App.tsx` — non-critical pages |
| `useMemo` / `useCallback` | `AuthContext`, `ToastContext`, `KanbanBoard`, `SearchFilter` |
| `React.memo` | `KanbanColumn` |
| Debounced search (300ms) | `SearchFilter.tsx` |
| Consolidated dashboard queries | `DashboardPage` + backend `getResolvedCountsAll` |

---

## 9. Testing Design

### 9.1 Backend Integration Tests

**Framework:** Jest + Supertest + dedicated test database (`ticket_management_test`).

**Suites** (`backend/tests/`):
| File | Coverage |
|------|----------|
| `state-machine.test.ts` | All valid/invalid transitions (mandatory) |
| `tickets.test.ts` | CRUD, search, filter, pagination |
| `comments.test.ts` | Create, list, validation |
| `users.test.ts` | User CRUD (admin) |
| `roles.test.ts` | Role CRUD (admin) |

**Setup:** `global-setup.ts` / `global-teardown.ts` manage test DB lifecycle. `helpers.ts` provides auth tokens and test user fixtures.

### 9.2 Frontend Tests

**Framework:** Vitest + React Testing Library + jsdom.

**Coverage:** `EditTicketPage.test.tsx` — form rendering, validation, submit flow with mocked services.

Frontend test coverage is intentionally lighter; backend integration tests are the primary quality gate.

---

## 10. Infrastructure Design

### 10.1 Docker Compose

Three-service stack:
1. **db** — PostgreSQL 16 with healthcheck; auto-runs schema + seed on first start
2. **backend** — Express API on port 3001
3. **frontend** — Vite dev server on port 5173

Environment variables sourced from per-app `.env` files via `env_file` directive.

### 10.2 Environment Configuration

| App | Config File | Key Variables |
|-----|------------|---------------|
| Backend | `backend/.env` | `DB_HOST`, `DB_PORT`, `JWT_SECRET`, `PORT` |
| Frontend | `frontend/.env` | `VITE_API_URL` |

`.env.example` files contain placeholders only. Real values are never committed.

---

## 11. Key Trade-offs

| Decision | Chosen | Alternative Considered | Why |
|----------|--------|---------------------|-----|
| Auth model | JWT (stateless) | Server sessions | Simpler for SPA + API separation |
| State machine location | Dedicated module + service | DB triggers only | Testable, explicit error messages |
| Role permissions | JSONB in DB | Hardcoded enum | Flexible screen-level RBAC without code changes |
| Frontend routing | React Router v6 + lazy load | All pages eager-loaded | Smaller initial bundle |
| Test strategy | Backend integration-heavy | Full E2E with Playwright | Faster feedback, covers critical business rules |
| DB scripts | Inside `backend/` | Top-level `database/` | Co-location with API owner |

---

## 12. Traceability

```
tool-specific/other-tool-workflow/requirements.md (state machine rules, API design)
  → backend/src/models/state-machine.ts (canonical rules)
  → backend/src/services/ticket.service.ts (enforcement)
  → backend/tests/state-machine.test.ts (verification)
  → frontend KanbanBoard + TicketDetailPage (UI enforcement)
```