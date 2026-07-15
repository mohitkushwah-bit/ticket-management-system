# Acceptance Criteria

## Core Acceptance Criteria (Mandatory — All Must Pass)

### 1. Ticket Creation
- **Given** a user on the create ticket form
- **When** they submit valid data (title, description, priority)
- **Then** a new ticket is created with status `Open` and persisted in the database

### 2. Ticket Listing
- **Given** tickets exist in the database
- **When** a user navigates to the ticket list
- **Then** all tickets are displayed with title, status, priority, assignee, and date

### 3. Ticket Detail View
- **Given** a ticket exists
- **When** a user clicks on the ticket
- **Then** all fields and associated comments are displayed

### 4. Ticket Update
- **Given** a user viewing a ticket
- **When** they update title, description, priority, or assignee
- **Then** the changes are persisted and `updatedAt` is refreshed

### 5. Add Comments
- **Given** a user viewing a ticket
- **When** they submit a comment
- **Then** the comment is persisted and appears in the ticket's comment list

### 6. Status State Machine (Critical)
- **Given** a ticket with status `Open`
- **When** transitioning to `In Progress` → **Then** succeeds (200)
- **When** transitioning to `Cancelled` → **Then** succeeds (200)
- **When** transitioning to `Resolved` → **Then** REJECTED (400/422)
- **When** transitioning to `Closed` → **Then** REJECTED (400/422)

- **Given** a ticket with status `In Progress`
- **When** transitioning to `Resolved` → **Then** succeeds (200)
- **When** transitioning to `Cancelled` → **Then** succeeds (200)
- **When** transitioning to `Open` → **Then** REJECTED (400/422)

- **Given** a ticket with status `Resolved`
- **When** transitioning to `Closed` → **Then** succeeds (200)
- **When** transitioning to any other status → **Then** REJECTED (400/422)

- **Given** a ticket with status `Closed` or `Cancelled`
- **When** attempting any transition → **Then** REJECTED (400/422)

### 7. Search and Filter
- **Given** tickets exist with various titles and statuses
- **When** user searches by keyword → **Then** only matching tickets appear
- **When** user filters by status → **Then** only tickets with that status appear
- **When** combined → **Then** both filters apply together

### 8. Data Persistence
- **Given** tickets and comments in the database
- **When** the server restarts
- **Then** all data is still available

### 9. Backend Validation
- **Given** a POST/PATCH request with missing required fields
- **When** the request hits the API
- **Then** returns 400/422 with structured error message (never creates invalid records)

### 10. No Secrets in Repo
- `.env` is in `.gitignore`
- `.env.example` contains only placeholder values
- No hardcoded credentials in source code

### 11. State-Machine Integration Tests
- Tests exist in `backend/tests/`
- All valid transitions are tested and pass
- All invalid transitions are tested and rejected
- Tests run via `npm run test:integration`

---

## Stretch Acceptance Criteria (Optional)

### Authentication
- User can login with email/password and receive JWT
- Protected routes return 401 without valid token
- Role-based: admin can do everything, agent can manage tickets, user can only view/comment

### Advanced Filters
- Filter by priority works
- Filter by assignee works
- Pagination returns correct page size and total count
- Sorting by any field works

### Docker
- `docker-compose up` starts the full stack (frontend, backend, DB)
- Application is accessible on expected ports
- No manual setup required beyond Docker

### CI Pipeline
- GitHub Actions runs lint, build, and tests on push
- Pipeline passes on clean code
- Pipeline fails on test failures

---

## Definition of Done (Entire Project)

- [ ] All 11 Core acceptance criteria pass
- [ ] Integration tests pass (`npm run test:integration`)
- [ ] README has working setup instructions (clone → run)
- [ ] No secrets committed to repository
- [ ] Prompt history available in `.copilot-sessions/`
- [ ] Requirements documented (`docs/requirements.md`)
- [ ] Design decisions documented (`docs/design.md`)
- [ ] AI reflection written (`docs/reflection.md`)
- [ ] PR description written
- [ ] `tool-workflow.md` submitted (Part A)
