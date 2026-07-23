# Frontend tests

Component tests run from `src/frontend/tests/` (Vitest project root).

This folder mirrors the submission layout path. Canonical test files:

| File | Coverage |
|------|----------|
| `TicketListPage.test.tsx` | List, filters, navigation |
| `CreateTicketPage.test.tsx` | Create form submit |
| `EditTicketPage.test.tsx` | Edit form prefill + update |
| `UsersPage.test.tsx` | User CRUD flows |
| `RolesPage.test.tsx` | Role CRUD + built-in protection |
| `KanbanBoard.test.tsx` | Columns, drag rules, callbacks |
| `KanbanPage.test.tsx` | Board load + ticket navigation |

Shared helpers: `fixtures.ts`, `shared-mocks.ts`

Run: `cd src/frontend && npm test`
