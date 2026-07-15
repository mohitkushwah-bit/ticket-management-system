# Review Fixes

Changes implemented after AI-assisted review sessions documented in `.copilot-sessions/prompts_2026-07-10.log` (14:09–15:45).

## Security Fixes (session 14:41–14:51)

Prompt: `check for security concerns` → `implement the solution for each security issue`

| Issue | Fix | File(s) |
|-------|-----|---------|
| Missing security headers | `app.use(helmet())` | `src/backend/src/app.ts` |
| Permissive CORS (`*`) | Restrict to `ALLOWED_ORIGINS` env (comma-separated) | `src/backend/src/app.ts` |
| No rate limiting | `express-rate-limit` middleware | `src/backend/src/app.ts` |
| Unlimited request body | `express.json({ limit: '10kb' })` | `src/backend/src/app.ts` |
| Swagger exposed in production | Gate with `env.nodeEnv !== 'production'` | `src/backend/src/app.ts` |
| Password storage | bcrypt `$2b$12$` rounds | `src/backend/src/services/auth.service.ts` |
| SQL injection risk | Parameterized queries only; `SORT_COLUMNS` whitelist | all `src/backend/src/repositories/` |

## Performance Fixes (sessions 12:25–14:07)

Prompt: `optimize the code` → scoped second pass listing already-applied items

| Issue | Fix | File(s) |
|-------|-----|---------|
| Eager route loading | `React.lazy` + `Suspense` for 8 pages | `src/frontend/src/App.tsx` |
| Context re-renders | `useMemo` on context values | `src/frontend/src/context/AuthContext.tsx`, `ToastContext.tsx` |
| `useRole` re-renders | `useMemo` on return object | `src/frontend/src/hooks/useRole.ts` |
| Kanban column re-renders | `React.memo` wrapper | `src/frontend/src/components/KanbanColumn.tsx` |
| Kanban ticket grouping | `useMemo` for `ticketsByStatus` | `src/frontend/src/components/KanbanBoard.tsx` |
| Search API on every keystroke | 300ms debounce via `useEffect` + `setTimeout` | `src/frontend/src/components/SearchFilter.tsx` |
| Duplicate COUNT + SELECT | `COUNT(*) OVER()` window in single query | `src/backend/src/repositories/ticket.repository.ts` |
| Dashboard multiple API calls | `getResolvedCountsAll()` consolidated endpoint | `src/backend/src/services/ticket.service.ts`, `DashboardPage.tsx` |
| TicketDetail handlers | `useCallback` for status/comment handlers | `src/frontend/src/pages/TicketDetailPage.tsx` |
| SearchFilter options | `useMemo` for dropdown option arrays | `src/frontend/src/components/SearchFilter.tsx` |
| Hardcoded user ID | Replaced with `useAuth().user` | `src/frontend/src/pages/TicketDetailPage.tsx` |

## Error Handling Fixes (session 07-07)

Prompt: Show exact backend validation message in toast, not generic banner

| Issue | Fix | File(s) |
|-------|-----|---------|
| Generic "Failed to update ticket" | `getApiErrorMessage()` extracts `errors[].message` | `src/frontend/src/services/error-utils.ts` |
| Banner errors on forms | Replaced with `showToast('error', ...)` | `EditTicketPage`, `CreateTicketPage`, `TicketDetailPage`, `KanbanPage`, `UsersPage`, `RolesPage` |

## Code Quality Fixes (session 15:38–15:45)

Prompt: `/format-and-cleanup` — read-only analysis then fixes

| Issue | Fix | File(s) |
|-------|-----|---------|
| Unused imports | Removed across backend and frontend | 60+ files in `src/backend/src/`, `src/frontend/src/` |
| Import ordering | External → internal → relative, blank lines between groups | All source files |
| Dead code | Removed commented blocks and unreachable code | Various |
| Inconsistent error format | Unified `AppError` + `error-handler` middleware | `src/backend/src/middleware/error-handler.ts` |

## Test Fixes (session 14:58–15:07)

Prompt: `Run all tests... add tests for roles and user crud` → `verify every test pass`

| Issue | Fix | File(s) |
|-------|-----|---------|
| Missing user CRUD tests | Added 24-case suite | `tests/backend/users.test.ts` |
| Missing role CRUD tests | Added 20-case suite | `tests/backend/roles.test.ts` |
| Test path after restructure | Jest roots → `../../tests/backend/` | `src/backend/jest.config.js` |
| Test DB setup paths | Migration/seed from `../../database/` | `tests/backend/global-setup.ts` |

## Rejected Fixes

| Proposed fix | Session | Reason |
|--------------|---------|--------|
| Dummy bcrypt hash on failed login | 07-10 14:53 | Over-engineered; removed after `/explain-code` |
| Full DI framework rewrite | 07-10 review | Constructor injection sufficient |
| `React.memo` on all common components | 07-10 13:58 | Diminishing returns; applied only to `KanbanColumn` |
| Playwright E2E suite | planning | Integration tests cover state machine adequately |
