# Implementation Plan

## Overview

Build a full-stack ticket management system in phases: infrastructure → backend core (including state machine) → frontend → tests → stretch features → documentation. Critical path is database schema → ticket service with state machine → API → mandatory integration tests.

## Task Breakdown

### Phase 1: Foundation
- Initialize backend (Express + TypeScript) and frontend (React + Vite)
- Docker Compose with PostgreSQL
- Database migrations and seed data in `database/`

### Phase 2: Backend Core
- User, Ticket, Comment repositories and services
- State machine module (`src/backend/src/models/state-machine.ts`)
- Ticket/comment controllers and routes with Zod validation
- Search, filter, pagination on ticket list

### Phase 3: Frontend Core
- API client with JWT interceptors
- Ticket list, detail, create/edit forms
- Status transition UI and Kanban board
- Comment section, search/filter, error/loading states

### Phase 4: Testing
- State-machine integration tests (mandatory)
- Ticket CRUD, comment, user, role integration tests
- Frontend EditTicketPage component test

### Phase 5: Stretch
- JWT auth, RBAC, user/role CRUD
- Swagger, Dockerfiles, security hardening (helmet, CORS, rate limit)
- Performance optimizations (lazy routes, memoization, debounced search)

### Phase 6: Submission Artifacts
- Restructure to assessment layout (`src/`, `tests/`, `database/`)
- Create all required markdown artifacts and `ai-prompts/`

## Milestones

| Milestone | Deliverable |
|-----------|-------------|
| M1 | DB schema + seed data running in Docker |
| M2 | Ticket API with state machine enforcement |
| M3 | Frontend ticket flows + Kanban |
| M4 | All integration tests green |
| M5 | Auth, RBAC, stretch features |
| M6 | Submission documentation complete |

## AI Usage Plan

| Phase | AI Role |
|-------|---------|
| Requirements | `@task-planner` → structured requirements and acceptance criteria |
| Planning | `/plan-and-execute` → phased task list with dependencies |
| Implementation | `/build-feature`, `senior-developer` skill → layered code generation |
| Testing | `@testing` → integration test suites |
| Review | `@review`, `/find-bugs`, `@security` → quality and security passes |
| Debugging | `@fix-error` → runtime and path issues |
| Documentation | Populate submission artifacts from session logs |

## Risks

| Risk | Impact |
|------|--------|
| State machine bugs | Invalid transitions accepted — high |
| Auth/RBAC gaps | Unauthorized writes — high |
| AI over-engineering | Unnecessary complexity — medium |
| Test DB setup flaky | CI/local test failures — medium |

## Mitigation

- Dedicated `state-machine.test.ts` covering full transition matrix
- `authorize` middleware on all write routes; frontend route guards
- Human review of AI security suggestions (e.g., rejected dummy hash)
- `global-setup.ts` / `global-teardown.ts` for isolated test database lifecycle
