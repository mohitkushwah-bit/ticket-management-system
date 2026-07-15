# Test Results

Test execution against the current codebase layout (`src/`, `tests/`, `database/`). Prompt verification sessions: `.copilot-sessions/prompts_2026-07-10.log` (14:58, 15:07).

## Backend Integration Tests

**Command:**
```bash
cd src/backend && npm run test:integration
```

**Framework:** Jest 29 + Supertest 7 + ts-jest  
**Config:** `src/backend/jest.config.js` → roots `../../tests/backend/`  
**Database:** `ticket_management_test` (created/dropped per run by `global-setup.ts` / `global-teardown.ts`)  
**Prerequisite:** PostgreSQL on `localhost:5432` (`docker-compose up db -d`)

| Suite | File | `it()` cases | Coverage | Status |
|-------|------|-------------|----------|--------|
| State machine | `tests/backend/state-machine.test.ts` | 11 | Valid transitions (Open→In Progress, etc.), all invalid paths, terminal states | Pass (verified 07-10) |
| Tickets | `tests/backend/tickets.test.ts` | 19 | CRUD, search, filter, pagination, validation, RBAC | Pass (verified 07-10) |
| Comments | `tests/backend/comments.test.ts` | 6 | Create, list, empty message, 404 | Pass (verified 07-10) |
| Users | `tests/backend/users.test.ts` | 24 | Admin CRUD, 401/403, validation | Pass (added 07-10 14:58) |
| Roles | `tests/backend/roles.test.ts` | 20 | Admin CRUD, permissions JSONB | Pass (added 07-10 14:58) |

**Total backend cases:** ~80

### Key state-machine results

| Transition | HTTP | Verified |
|------------|------|----------|
| open → in_progress | 200 | Yes |
| open → cancelled | 200 | Yes |
| in_progress → resolved | 200 | Yes |
| resolved → closed | 200 | Yes |
| open → resolved | 422 | Yes |
| closed → in_progress | 422 | Yes |
| cancelled → any | 422 | Yes |

Uses seed ticket IDs from `database/seeds/seed.sql` (e.g., `22222222-...` = open, `11111111-...` = in_progress).

## Frontend Tests

**Command:**
```bash
cd src/frontend && npm test
```

**Framework:** Vitest 0.34 + React Testing Library 14 + jsdom  
**Config:** `src/frontend/vitest.config.ts` → includes `../../tests/frontend/`  
**Setup:** `src/frontend/src/test/setup.ts`

| Suite | File | Tests | Coverage | Status |
|-------|------|-------|----------|--------|
| Edit ticket form | `tests/frontend/EditTicketPage.test.tsx` | 1 | Prefill fields, edit title/description/priority, submit calls API, navigate on success | Pass |

## Manual Verification Checklist

Verified during development sessions (not automated):

- [x] `docker-compose up -d` starts db + backend + frontend
- [x] Login with seed users (`alice@example.com` / `password123`)
- [x] Create ticket → appears in list with status `open`
- [x] Edit ticket with invalid PR link → toast shows `"PR link must be a valid URL"` (fix verified 07-07)
- [x] Search partial keyword `"local"` matches `"Add Localization to pages"` (fix verified 07-07)
- [x] Kanban drag to invalid column → toast error, card snaps back
- [x] Agent (`bob@example.com`) cannot create/edit tickets (403 / route redirect)
- [x] Admin can manage users and roles with permission checkboxes
- [x] Dashboard shows status counts and resolved stats
- [x] Swagger UI accessible at `http://localhost:3001/api-docs`
- [x] Data persists after `docker-compose restart`

## Post-Restructure Notes (2026-07-15)

After moving to submission layout, these paths were updated and should be re-verified:

| Component | Old path | New path |
|-----------|----------|----------|
| Backend app | `backend/src/app` | `src/backend/src/app` |
| Test suites | `backend/tests/` | `tests/backend/` |
| Migrations | `backend/database/` | `database/` |
| Jest config | `roots: ['<rootDir>/tests']` | `roots: ['<rootDir>/../../tests/backend']` |
| Frontend test | `frontend/src/pages/EditTicketPage.test.tsx` | `tests/frontend/EditTicketPage.test.tsx` |

**Action:** Re-run both test commands after restructure to confirm all import paths resolve.

## Session Evidence

| Date | Prompt | Result |
|------|--------|--------|
| 2026-07-10 14:58 | "add tests for roles and user crud" | `users.test.ts`, `roles.test.ts` created |
| 2026-07-10 15:07 | "verify every test pass" | All backend + frontend suites green |
| 2026-07-15 | Submission restructure | Paths updated; re-run recommended |
