# Acceptance Criteria

## Core

- [x] User can create a ticket via UI; status defaults to `open`
- [x] User can view all tickets from the database in a list
- [x] User can open ticket detail with all fields and comments
- [x] User can update ticket fields and reassign; `updatedAt` refreshes
- [x] User can add comments to a ticket
- [x] Status changes only through valid transitions; invalid ones rejected (integration tested)
- [x] Keyword search and status filter work individually and combined
- [x] Data persists after server restart (PostgreSQL + Docker volumes)
- [x] Kanban drag-and-drop enforces same state machine rules as detail view

## Validation

- [x] Backend rejects missing required fields with 400/422
- [x] Structured error responses with field-level messages where applicable
- [x] PR link validated as URL when provided
- [x] Frontend shows inline form validation errors

## Error Handling

- [x] API returns consistent `{ errors: [{ message, field? }] }` format
- [x] UI shows toast notifications for failed operations
- [x] Network/auth errors redirect or display meaningful messages
- [x] Invalid Kanban drops show user-visible error and revert card position

## Testing

- [x] State-machine integration tests cover all valid transitions
- [x] State-machine integration tests reject all invalid transitions
- [x] Ticket CRUD integration tests pass
- [x] Comment integration tests pass
- [x] Tests run via `cd src/backend && npm run test:integration`
- [x] Frontend tests: 7 suites / 23 cases in `src/frontend/tests/` (pages + KanbanBoard)
- [x] CI workflow runs backend + frontend tests (`.github/workflows/ci.yml`)

## Edge Cases (Documented & Tested)

| Edge case | Expected behavior | Evidence |
|-----------|-------------------|----------|
| Open → Resolved (skip step) | Rejected 422 | `state-machine.test.ts` |
| Closed/Cancelled → any status | Rejected 422 | `state-machine.test.ts` |
| Concurrent status update | Rejected 409 | `ticket.service.ts` + tests |
| Invalid Kanban drop | Card snaps back; toast error | `KanbanBoard.test.tsx` + manual |
| XSS in ticket title | HTML stripped server-side | `validation-schemas.ts` + `sanitize.ts` |
| Missing JWT in production | Server refuses to start | `config/env.ts` |
| DB direct invalid status UPDATE | Trigger raises exception | `002_status_transition_trigger.sql` |

## Documentation

- [x] README with setup instructions
- [x] `tool-workflow.md` (AI workflow foundation)
- [x] `requirements-analysis.md`, `design-notes.md`, `api-contract.md`
- [x] `ai-prompts/` with grouped prompt history
- [x] `reflection.md` and `final-ai-usage-summary.md`
- [x] No secrets committed; `.env.example` files use placeholders only

## Stretch (Implemented)

- [x] JWT authentication with protected routes
- [x] Role-based access control (admin, agent, user)
- [x] User and role management UI
- [x] Swagger API docs at `/api-docs`
- [x] Docker Compose runs db + backend + frontend
- [x] Pagination, sorting, priority filter on ticket list
