# AI Prompts — Implementation

Evidence from `.copilot-sessions/` and resulting code in `src/backend/` and `src/frontend/`.

---

## Prompt 1: Requirements-driven features (2026-07-06)

**Prompt:** Add to requirements:
1. PR link field on ticket entity
2. Integration tests for create/update ticket and comments
3. Jira-like Kanban drag-and-drop with state machine enforcement

**AI Response:** Updated requirements; planned Kanban with @dnd-kit, `pr_link` column, test suites.

**Accepted:** All three features implemented.  
**Changed:** Kanban highlights valid drop targets; PR link Zod URL validation.  
**Rejected:** Client-only status change without API round-trip.

**Codebase:**
- `database/migrations/001_initial_schema.sql` — `pr_link` column
- `src/frontend/src/components/KanbanBoard.tsx` — @dnd-kit DnD
- `tests/backend/tickets.test.ts`, `comments.test.ts`

---

## Prompt 2: Chunked implementation plan (2026-07-06)

**Prompt:** Move in chunks: user → ticket CRUD → comments → kanban → dashboard stats. Use React Testing Library. Create common UI controls.

**AI Response:** Phased build order; `components/common/` design system; Vitest + RTL setup.

**Accepted:** Implementation sequence and common components (`Button`, `Input`, `Card`, etc.).  
**Changed:** Dashboard added resolved counts by week/month/year.  
**Rejected:** —

**Codebase:**
- `src/frontend/src/components/common/`
- `src/frontend/src/pages/DashboardPage.tsx`
- `src/frontend/src/test/setup.ts`

---

## Prompt 3: Ticket edit feature (2026-07-07)

**Prompt:** `/build-feature Add functionality to edit a ticket`

**AI Response:** `EditTicketPage.tsx`, route in `App.tsx`, PATCH handler.

**Accepted:** Full edit flow with assignee dropdown and PR link field.  
**Changed:** —  
**Rejected:** —

**Codebase:** `src/frontend/src/pages/EditTicketPage.tsx`, `tests/frontend/EditTicketPage.test.tsx`

---

## Prompt 4: Advanced filters and pagination (2026-07-07)

**Prompt:** `/build-feature Add Filter by priority and assignee, sorting and pagination on Ticket list screen`

**AI Response:** Extended `ticket.repository.ts` `findAll()` with filter params; `SearchFilter.tsx` controls; paginated API response.

**Accepted:** 7 sort options, priority/assignee filters, page/limit meta.  
**Changed:** Whitelist `SORT_COLUMNS` to prevent SQL injection.  
**Rejected:** —

**Codebase:** `src/backend/src/repositories/ticket.repository.ts`, `src/frontend/src/components/SearchFilter.tsx`

---

## Prompt 5: Authentication (2026-07-08)

**Prompt:** `/build-feature Add Login screen, authentication, encrypted password, logout, profile screen`

**AI Response:** JWT auth flow, bcrypt hashing, `AuthContext`, protected routes, `LoginPage`, `ProfilePage`, header logout.

**Accepted:** Full auth stack on both sides.  
**Changed:** Token stored in localStorage; 401 interceptor redirects to login.  
**Rejected:** —

**Codebase:**
- `src/backend/src/services/auth.service.ts`, `middleware/auth.ts`
- `src/frontend/src/pages/LoginPage.tsx`, `context/AuthContext.tsx`, `services/api.ts`

---

## Prompt 6: Roles and RBAC (2026-07-09)

**Prompt:** `/build-feature Create Roles & User screens and CRUD APIs. Admin only. Role checks on frontend AND backend.`

Follow-ups: checkbox permissions matrix per screen; `role_id` FK instead of enum column.

**AI Response:** `roles` table with JSONB permissions, `UsersPage`, `RolesPage`, `RoleFormModal`, `authorize` middleware.

**Accepted:** Database-driven RBAC with admin/agent/user defaults.  
**Changed:** `WriterRoute` for ticket write access; agent read-only.  
**Rejected:** Frontend-only role checks.

**Codebase:**
- `src/backend/src/routes/role.routes.ts`, `user.routes.ts`
- `src/frontend/src/pages/UsersPage.tsx`, `RolesPage.tsx`
- `src/frontend/src/components/AdminRoute.tsx`, `WriterRoute.tsx`

---

## Prompt 7: Swagger documentation (2026-07-10)

**Prompt:** `Create swagger documentation for the backend API`

**AI Response:** `src/backend/src/config/swagger.ts`, UI at `/api-docs`.

**Accepted:** OpenAPI spec for all endpoints.  
**Changed:** Disabled in production after security review.  
**Rejected:** —

---

## Prompt 8: Infrastructure and Docker (2026-07-10)

**Prompts:**
- Merge migrations into `001_initial_schema.sql`
- Separate README, .gitignore, .env per app
- `update docker-compose file to use environment variables from .env files`

**AI Response:** Consolidated schema, per-app config, compose `env_file` directives.

**Accepted:** Three-service Docker stack.  
**Changed:** Database ultimately at top-level `database/` for submission layout.  
**Rejected:** —

**Codebase:** `docker-compose.yml`, `src/backend/.env.example`, `src/frontend/.env.example`

---

## Prompt 9: Toast error messages (2026-07-07)

**Prompt:** Backend returns `"PR link must be a valid URL"` but UI shows generic error in banner — fix to show exact message in toast across all pages.

**AI Response:** `error-utils.ts` with `getApiErrorMessage()`; updated all pages to use `showToast`.

**Accepted:** Field-level API messages in toasts.  
**Changed:** Removed banner-style error display on edit page.  
**Rejected:** —

**Codebase:** `src/frontend/src/services/error-utils.ts`, used in `KanbanPage`, `TicketDetailPage`, `EditTicketPage`, etc.

---

## Prompt 10: Submission restructure (2026-07-15)

**Prompt:** Restructure per assessment document — `src/`, `tests/`, `database/`, documentation artifacts.

**AI Response:** Moved apps under `src/`, tests to `tests/`, database to root; updated all path references.

**Accepted:** Full submission layout.  
**Changed:** Jest roots, vitest include paths, compose mounts.  
**Rejected:** —
