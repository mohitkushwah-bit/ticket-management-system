# AI Prompts — Testing

## Prompt 1: State machine integration tests (mandatory)

**Prompt:** `@testing` — write integration tests proving all valid and invalid status transitions.

**AI Response:** `state-machine.test.ts` with matrix of transitions using Supertest against real app + test DB.

**Accepted:** Full transition coverage for all ticket statuses.  
**Changed:** Added seed ticket IDs for each status in test fixtures.  
**Rejected:** Mocking service layer (kept real HTTP integration per instructions).

---

## Prompt 2: CRUD and comment tests

**Prompt:** Add integration tests for create/update ticket and comment on ticket.

**AI Response:** `tickets.test.ts`, `comments.test.ts` with validation error cases.

**Accepted:** CRUD, search, filter, pagination, comment validation tests.  
**Changed:** Added user and role CRUD tests in later session.  
**Rejected:** —

---

## Prompt 3: Test verification

**Prompt:** Run all tests for frontend and backend, and verify every test pass.

**AI Response:** Executed `npm run test:integration` and `npm test`, fixed failing paths.

**Accepted:** Test run commands in README and `test-results.md`.  
**Changed:** Updated jest roots after `tests/` folder move.  
**Rejected:** —

---

## Prompt 4: Frontend component test

**Prompt:** Add frontend test for EditTicketPage form behavior.

**AI Response:** Vitest + RTL test with mocked services for prefill and submit.

**Accepted:** `tests/frontend/EditTicketPage.test.tsx`.  
**Changed:** Moved test to `tests/frontend/` per submission structure.  
**Rejected:** —
