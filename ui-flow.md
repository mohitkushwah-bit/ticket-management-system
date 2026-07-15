# UI Flow

User flows mapped to implemented routes in `src/frontend/src/App.tsx`, pages, and API calls in `src/frontend/src/services/`. Prompt origins noted from `.copilot-sessions/`.

## Authentication Flow

**Implemented:** 2026-07-08 (`/build-feature Add Login screen...`)

```
/login
  → user enters email + password
  → POST /api/auth/login (src/backend/src/routes/auth.routes.ts)
  → AuthContext stores JWT + user in localStorage
  → redirect to / (Dashboard)

Any API call → 401
  → api.ts interceptor clears auth
  → redirect to /login
```

**Pages:** `LoginPage.tsx`  
**Backend:** `auth.controller.ts`, `auth.service.ts` (bcrypt verify)

## Main Navigation (Authenticated)

All routes wrapped in `ProtectedRoute` → `Layout` (sidebar + header with username/logout).

| Route | Page component | Access guard | API dependencies |
|-------|---------------|--------------|------------------|
| `/` | `DashboardPage` | All authenticated | `GET /tickets/stats/status-counts`, `/stats/resolved-all` |
| `/tickets` | `TicketListPage` | All | `GET /tickets?search&status&priority&assignee&page&sort` |
| `/tickets/new` | `CreateTicketPage` | `WriterRoute` (admin, user) | `POST /tickets` |
| `/tickets/:id` | `TicketDetailPage` | All | `GET /tickets/:id`, `GET /comments`, status PATCH |
| `/tickets/:id/edit` | `EditTicketPage` | `WriterRoute` | `GET /tickets/:id`, `PATCH /tickets/:id` |
| `/kanban` | `KanbanPage` | All (write via API: admin, user) | `GET /tickets`, `PATCH /tickets/:id/status` |
| `/profile` | `ProfilePage` | All | `GET /auth/me`, `PATCH /auth/me` |
| `/users` | `UsersPage` | `AdminRoute` | User CRUD APIs |
| `/roles` | `RolesPage` | `AdminRoute` | Role CRUD APIs + `RoleFormModal` |

**Lazy loading:** All pages except `LoginPage` and `DashboardPage` use `React.lazy` + `Suspense` (optimization, 07-10).

## Role-Based UI Behavior

From `useRole()` hook and route guards (implemented 2026-07-09):

| Role | Can view tickets | Can create/edit | Can change status | Admin screens |
|------|-----------------|---------------|-------------------|---------------|
| admin | Yes | Yes | Yes | Users, Roles |
| user | Yes | Yes | Yes | No |
| agent | Yes | No (WriterRoute redirects) | No (API 403) | No |

**Kanban:** Agent can view board but `handleStatusChange` returns false on API 403 → card snaps back.

## Ticket Lifecycle

### List View (`TicketListPage`)

1. Navigate to `/tickets`
2. `SearchFilter` renders: keyword (debounced 300ms), status, priority, assignee, sort dropdown
3. `ticketService.getAll(filters)` → paginated table
4. Click row → `/tickets/:id`

**Prompt origin:** Filters/pagination (07-07), debounce (07-10 13:52)

### Create Flow (`CreateTicketPage`)

1. Click "New Ticket" → `/tickets/new` (only if `canWrite`)
2. `TicketForm`: title*, description*, priority*, optional assignee, optional PR link
3. Submit → `POST /api/tickets` → redirect to `/tickets/:id`
4. Validation error → toast with backend message (e.g., invalid URL)

### Detail View (`TicketDetailPage`)

1. Load ticket + comments + users in parallel (`Promise.all`)
2. Display: title, description, priority, status badge, assignee, creator, PR link, timestamps
3. Status buttons: only `VALID_TRANSITIONS[currentStatus]` shown (if `canWrite`)
4. Click status → `PATCH /tickets/:id/status` → refresh or toast on 422
5. Add comment → `POST /tickets/:id/comments` → append to list

**Prompt origin:** "Created by" field added (07-07), toast errors (07-07)

### Edit Flow (`EditTicketPage`)

1. From detail → Edit → `/tickets/:id/edit`
2. Form prefilled from `GET /tickets/:id`
3. Submit → `PATCH /tickets/:id` → navigate back to detail
4. Tested: `tests/frontend/EditTicketPage.test.tsx`

### Kanban Flow (`KanbanPage` + `KanbanBoard`)

**Prompt origin:** Jira-like board (07-06)

1. Navigate to `/kanban`
2. `ticketService.getAll({ limit: 100 })` loads all tickets
3. `KanbanBoard` groups by status column: open, in_progress, resolved, closed, cancelled
4. Drag card (`@dnd-kit`, 8px activation distance):
   - Client checks `VALID_TRANSITIONS` before API call
   - `PATCH /tickets/:id/status` on valid drop
   - Success → update local state
   - Failure → `showToast('error', getApiErrorMessage(...))` → return `false` → card snaps back
5. Click card → navigate to `/tickets/:id`

## Admin Flows

### User Management (`UsersPage`) — 2026-07-09

1. Admin navigates to `/users`
2. Table of users with role name
3. Create/edit modal: name, email, password, role dropdown
4. Delete with confirmation
5. Non-admin → `AdminRoute` redirects to `/`

### Role Management (`RolesPage`) — 2026-07-09

1. Admin navigates to `/roles`
2. `RoleFormModal`: name, description, 5 screens × read/write checkboxes
3. Permissions stored as JSONB in `roles.permissions`
4. Default roles (admin, agent, user) seeded in migration

## Error & Loading States

| State | UI behavior | Implementation |
|-------|------------|----------------|
| Loading | `LoadingSpinner` centered | All pages during fetch |
| API validation error | Red toast with exact backend message | `getApiErrorMessage()` + `showToast` |
| 401 Unauthorized | Redirect to login | `api.ts` response interceptor |
| 403 Forbidden | Toast or route redirect | `WriterRoute`, `AdminRoute` |
| Empty search results | "No tickets found" message | `TicketListPage` |
| Invalid Kanban drop | Error toast + card snap-back | `KanbanPage.handleStatusChange` returns boolean |

## Component Map

| Page | Key components | Services |
|------|---------------|----------|
| `DashboardPage` | stat cards, charts | `ticketService.getStatusCounts`, `getResolvedCountsAll` |
| `TicketListPage` | `SearchFilter`, `StatusBadge`, pagination | `ticketService.getAll` |
| `TicketDetailPage` | `CommentList`, `StatusBadge`, status buttons | `ticketService`, `commentService`, `userService` |
| `CreateTicketPage` / `EditTicketPage` | `TicketForm` | `ticketService.create/update` |
| `KanbanPage` | `KanbanBoard`, `KanbanColumn`, `TicketCard` | `ticketService.changeStatus` |
| `LoginPage` | form inputs | `authService.login` |
| `ProfilePage` | profile form | `authService.getMe`, `updateMe` |
| `UsersPage` | user table, modal | `userService` CRUD |
| `RolesPage` | role table, `RoleFormModal` | `roleService` CRUD |
| All pages | `Layout` (nav, header), `Toast` | — |

## Design System

Common controls (prompt 07-06): `src/frontend/src/components/common/`  
CSS tokens: `src/frontend/src/styles/variables.css`  
Global styles: `src/frontend/src/styles/global.css`
