# Test Strategy

Aligned with implemented test suites in `tests/` and prompts from `.copilot-sessions/` (2026-07-06, 2026-07-10).

## Test Scope

| Priority | What | Why |
|----------|------|-----|
| P0 | Status state machine integration tests | Mandatory assessment deliverable |
| P1 | Ticket CRUD + validation | Core business functionality |
| P1 | Comment create/list/validation | Core collaboration feature |
| P2 | User and role CRUD (admin) | Stretch RBAC feature |
| P3 | Frontend EditTicketPage component | Representative UI test |
| Manual | Kanban drag-drop, auth flows | Visual/interaction verification |

## Unit Tests

**State machine pure functions** (`isValidTransition`, `getValidTransitions`, `isTerminalState`) in `src/backend/src/models/state-machine.ts` are tested indirectly through HTTP integration tests rather than isolated unit tests.

**Rationale:** Integration tests prove end-to-end enforcement including middleware, auth, and DB persistence. Acceptable for assessment scope per prompt (2026-07-06): *"at least one meaningful test tier"* with integration as primary.

## Component Tests

| File | Framework | What it tests |
|------|-----------|---------------|
| `tests/frontend/EditTicketPage.test.tsx` | Vitest + RTL + jsdom | Form prefill from API, field edit, submit calls `ticketService.update`, navigation on success |

**Setup:** `src/frontend/src/test/setup.ts` (jest-dom matchers)  
**Config:** `src/frontend/vitest.config.ts` includes `../../tests/frontend/**/*.{test,spec}.{ts,tsx}`  
**Mocks:** `ticketService`, `userService`, `useNavigate` — services mocked, not internal layers

**Prompt origin (2026-07-06):** *"Use react testing library for react/frontend tests"*

**Run:**
```bash
cd src/frontend && npm test
```

## API / Integration Tests

**Framework:** Jest + Supertest + real Express app + dedicated PostgreSQL test DB

| File | `it()` cases | Coverage |
|------|-------------|----------|
| `tests/backend/state-machine.test.ts` | 11 | 5 valid transitions + invalid matrix + terminal states |
| `tests/backend/tickets.test.ts` | 19 | Create, update, list, search, filter, pagination, validation |
| `tests/backend/comments.test.ts` | 6 | Create, list, empty message, 404 |
| `tests/backend/users.test.ts` | 24 | Admin CRUD, auth checks, validation |
| `tests/backend/roles.test.ts` | 20 | Admin CRUD, permissions JSONB, auth checks |

**Total:** ~80 test cases

**Test infrastructure:**
- `tests/backend/global-setup.ts` — creates `ticket_management_test`, runs `database/migrations/` + `database/seeds/`
- `tests/backend/global-teardown.ts` — drops test DB
- `tests/backend/helpers.ts` — JWT tokens for admin/agent/user seed accounts

**Imports:** Tests import app from `../../src/backend/src/app` (post-restructure path)

**Naming convention** (per `integration-tests.instructions.md`): `should [behavior] when [condition]`

**Run:**
```bash
cd src/backend && npm run test:integration
```

**Prerequisite:** PostgreSQL on `localhost:5432` (or `docker-compose up db -d`)

## Edge Case Tests

Covered in integration suites:

| Edge case | Test location | Expected |
|-----------|--------------|----------|
| Open → Resolved (skip) | `state-machine.test.ts` | 422 |
| Closed → any transition | `state-machine.test.ts` | 422 |
| Cancelled → any transition | `state-machine.test.ts` | 422 |
| Concurrent status update | `state-machine.test.ts` / service | 409 |
| Missing required fields on create | `tickets.test.ts` | 400/422 |
| Invalid PR link URL | `tickets.test.ts` | 422 |
| Comment on missing ticket | `comments.test.ts` | 404 |
| No auth token | all suites | 401 |
| Agent attempting ticket write | `tickets.test.ts` | 403 |
| Non-admin user management | `users.test.ts` | 403 |

## Tests Not Covered (and why)

| Gap | Reason |
|-----|--------|
| E2E (Playwright/Cypress) | State machine proven at API layer; Kanban verified manually |
| State machine unit tests | Covered by 11 integration cases — sufficient for assessment |
| Full frontend page coverage | One representative RTL test per 2026-07-06 plan scope |
| `KanbanBoard` component test | DnD requires complex @dnd-kit mock setup; API tests cover transitions |
| Load/performance tests | Out of scope for internal tool |
| CI pipeline execution | No `.github/workflows/ci.yml` yet; tests run locally |
| Auth token refresh | Feature not implemented |

## Traceability

| Prompt | Test artifact |
|--------|--------------|
| 07-06: "integration test for create, update ticket, comment" | `tickets.test.ts`, `comments.test.ts` |
| 07-06: state machine mandatory | `state-machine.test.ts` |
| 07-10: "add tests for roles and user crud" | `users.test.ts`, `roles.test.ts` |
| 07-10: "verify every test pass" | All suites green |
| 07-15: tests moved to `tests/backend/` | Updated `jest.config.js`, import paths |

See [test-results.md](test-results.md) for execution commands and status.
