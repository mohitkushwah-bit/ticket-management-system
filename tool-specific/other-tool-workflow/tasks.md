# Tasks — Implementation Plan

## Phase 1: Foundation & Infrastructure

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 1 | Initialize backend project (Express + TypeScript) | `backend/package.json, tsconfig.json, src/index.ts` | S | — |
| 2 | Initialize frontend project (React + TypeScript) | `frontend/package.json, tsconfig.json, src/App.tsx` | S | — |
| 3 | Setup PostgreSQL with Docker Compose | `docker-compose.yml, .env.example` | S | — |
| 4 | Create database schema/migration scripts | `database/migrations/, database/init.sql` | M | 3 |
| 5 | Create seed data (users, tickets, comments) | `database/seeds/` | S | 4 |

## Phase 2: Backend Core

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 6 | Create User model and repository | `backend/src/models/user.ts, repositories/user.repository.ts` | S | 4 |
| 7 | Create Ticket model, repository, service | `backend/src/models/ticket.ts, repositories/, services/` | M | 4 |
| 8 | Implement state machine logic in Ticket service | `backend/src/services/ticket.service.ts` | M | 7 |
| 9 | Create Comment model, repository, service | `backend/src/models/comment.ts, repositories/, services/` | S | 4 |
| 10 | Create Ticket controller and routes (CRUD + status) | `backend/src/controllers/, routes/` | M | 7, 8 |
| 11 | Create Comment controller and routes | `backend/src/controllers/, routes/` | S | 9 |
| 12 | Add input validation middleware | `backend/src/middleware/validation.ts` | M | 10 |
| 13 | Add error handling middleware | `backend/src/middleware/error-handler.ts` | S | 10 |
| 14 | Add search and filter to ticket list endpoint | `backend/src/repositories/ticket.repository.ts` | M | 10 |

## Phase 3: Frontend Core

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 15 | Setup API client service layer | `frontend/src/services/api.ts` | S | 10 |
| 16 | Create Ticket List page with search/filter | `frontend/src/pages/TicketList.tsx` | M | 15 |
| 17 | Create Ticket Detail page | `frontend/src/pages/TicketDetail.tsx` | M | 15 |
| 18 | Create Ticket Form (create/edit) | `frontend/src/components/TicketForm.tsx` | M | 15 |
| 19 | Implement status transition UI with validation | `frontend/src/components/StatusTransition.tsx` | M | 15, 8 |
| 20 | Create Comment section component | `frontend/src/components/CommentSection.tsx` | S | 15 |
| 21 | Add error handling and loading states | `frontend/src/components/ErrorBoundary.tsx` | S | 16-20 |

## Phase 4: Testing

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 22 | Write state-machine integration tests (MANDATORY) | `backend/tests/state-machine.test.ts` | M | 8, 10 |
| 23 | Write ticket CRUD integration tests | `backend/tests/tickets.test.ts` | M | 10, 12 |
| 24 | Write comment integration tests | `backend/tests/comments.test.ts` | S | 11 |
| 25 | Write validation integration tests | `backend/tests/validation.test.ts` | S | 12 |

## Phase 5: Stretch (Optional)

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 26 | Implement JWT authentication | `backend/src/middleware/auth.ts, controllers/auth.controller.ts` | L | 6 |
| 27 | Add protected routes and RBAC | `backend/src/middleware/authorize.ts` | M | 26 |
| 28 | Add login/logout UI | `frontend/src/pages/Login.tsx` | M | 26 |
| 29 | Add pagination, sorting, advanced filters | `backend/src/repositories/, frontend/src/components/` | M | 14, 16 |
| 30 | Add Swagger/OpenAPI documentation | `backend/src/swagger.ts` | M | 10, 11 |
| 31 | Setup Dockerfile and full Docker Compose | `Dockerfile, docker-compose.yml` | M | 1, 3 |
| 32 | Setup GitHub Actions CI pipeline | `.github/workflows/ci.yml` | M | 22-25 |
| 33 | Write unit tests and edge-case tests | `backend/tests/unit/` | M | 7-9 |

## Phase 6: Documentation & Artifacts

| # | Task | Files | Size | Depends On |
|---|------|-------|------|-----------|
| 34 | Write README with full setup instructions | `README.md` | M | All |
| 35 | Write design notes document | `docs/design.md` | S | All |
| 36 | Write AI usage reflection | `docs/reflection.md` | M | All |
| 37 | Generate tool-workflow.md (Part A) | `tool-workflow.md` | M | All |
| 38 | Write PR description | PR artifact | S | All |

## Critical Path
```
3 → 4 → 7 → 8 → 10 → 22 (state-machine tests = mandatory deliverable)
```

## Total Estimates
- **Core (Tasks 1-25)**: ~40-50 hours
- **Stretch (Tasks 26-33)**: ~20-25 hours additional
- **Documentation (Tasks 34-38)**: ~8-10 hours
