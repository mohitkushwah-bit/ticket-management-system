# Debugging Notes

Each issue traced to `.copilot-sessions/` prompt logs and verified against the current codebase under `src/backend/` and `src/frontend/`.

---

## Issue 1: Vite `crypto.getRandomValues is not a function`

**Session:** `prompts_2026-07-06.log` (17:45)

### Problem
Frontend dev server failed on startup:
```
TypeError: crypto$2.getRandomValues is not a function
    at resolveConfig (.../vite/dist/node/chunks/...)
```

### How I Investigated
Pasted full stack trace. Checked Node.js version against Vite 4.x requirements.

### How AI Helped
Diagnosed Node.js version incompatibility — Vite 4 requires Node 18+ with Web Crypto API.

### What I Validated
Confirmed `src/frontend/package.json` uses Vite `^4.5.14`; server starts on Node 20.

### Final Fix
Use Node 20 (aligned with `src/backend/Dockerfile`). Run `npm ci` after version switch.

---

## Issue 2: Docker Compose startup and missing seed data

**Sessions:** `prompts_2026-07-06.log` (17:57, 18:02)

### Problem
1. `docker-compose up -d` failed on volume/path configuration
2. Container started but database had no seed data

### How I Investigated
Ran compose, inspected PostgreSQL init scripts and volume mounts.

### How AI Helped
Fixed compose service definitions and ensured migration/seed SQL mounted to `/docker-entrypoint-initdb.d/`.

### What I Validated
`docker-compose.yml` mounts `database/migrations/001_initial_schema.sql` and `database/seeds/seed.sql`; fresh `postgres_data` volume loads seed users and tickets.

### Final Fix
Correct volume paths; destroy stale volume if schema already partially applied (`docker-compose down -v` for clean re-init).

---

## Issue 3: Node.js `tracingChannel is not a function` (backend)

**Session:** `prompts_2026-07-10.log` (11:37)

### Problem
Backend `npm run dev` crashed in `lru-cache` via `path-scurry`:
```
TypeError: (0 , U.tracingChannel) is not a function
```

### How I Investigated
Full stack trace pasted; checked Node version vs dependency tree.

### How AI Helped
Identified Node 16/18 mismatch with packages requiring Node 20 diagnostics channel API.

### What I Validated
Backend starts cleanly on Node 20 Alpine in Docker.

### Final Fix
Node 20 in `src/backend/Dockerfile`; local dev on Node 20+.

---

## Issue 4: Partial search not matching substrings

**Session:** `prompts_2026-07-07.log` (22:11)

### Problem
Searching `"local"` did not match title `"Add Localization to pages"` — only full-token matches returned.

### How I Investigated
Reproduced via API; inspected SQL in `src/backend/src/repositories/ticket.repository.ts`.

### How AI Helped
Changed search from `to_tsvector` full-word match to `ILIKE '%term%'` pattern; added trigram GIN indexes.

### What I Validated
Partial substring search returns expected tickets; indexes in `001_initial_schema.sql` lines 100–101.

### Final Fix
```sql
(t.title ILIKE $N OR t.description ILIKE $N)  -- with %search% wrapping
```

---

## Issue 5: Generic UI error instead of backend validation message

**Session:** `prompts_2026-07-07.log` (21:39)

### Problem
PATCH with invalid `prLink` (`"https:// github.com/local"`) returned `{ errors: [{ message: "PR link must be a valid URL", field: "prLink" }] }` but UI showed generic `"Failed to update ticket. Please try again."` in a banner.

### How I Investigated
Compared network response to `EditTicketPage` error handling.

### How AI Helped
Created `src/frontend/src/services/error-utils.ts` with `getApiErrorMessage()`; updated pages to show toast with exact backend message.

### What I Validated
Invalid PR link now shows toast: `"PR link must be a valid URL"`. Same pattern applied to Kanban, ticket list, and admin screens.

### Final Fix

```7:13:src/frontend/src/services/error-utils.ts
export function getApiErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  const apiErr = err as ApiErrorResponse;
  if (apiErr?.errors?.length) {
    return apiErr.errors.map((e) => e.message).join('. ');
  }
  return fallback;
}
```

---

## Issue 6: Database folder path breakage (submission restructure)

**Session:** Restructure to assessment layout (2026-07-15)

### Problem
After moving `database/` to repository root and tests to `tests/backend/`, docker-compose mounts and `global-setup.ts` still referenced `backend/database/`.

### How I Investigated
Ran compose and integration test setup; grep for stale paths.

### How AI Helped
Updated `docker-compose.yml`, `tests/backend/global-setup.ts`, and Jest config in `src/backend/jest.config.js`.

### What I Validated
`global-setup.ts` reads `../../database/migrations/001_initial_schema.sql`; compose mounts `./database/`.

### Final Fix
All references now use top-level `database/` per submission structure.

---

## Issue 7: Dummy hash timing-attack mitigation (rejected)

**Session:** `prompts_2026-07-10.log` (14:53–14:56)

### Problem
AI added dummy bcrypt comparison on login failure to prevent timing attacks.

### How I Investigated
`/explain-code why we need dummy hash` — evaluated trade-off.

### What I Validated
Unnecessary for internal assessment; added complexity without meaningful threat model.

### Final Fix
**Rejected and removed** from `src/backend/src/services/auth.service.ts`.

---

## Issue 8: Supertest `mime.getType is not a function`

**Session:** Post-submission integration test run (2026-07-15)

### Problem
Backend integration tests failed across all suites:
```
TypeError: mime.getType is not a function
  at Test.getType [as type] (node_modules/superagent/src/node/index.js)
```

### How I Investigated
Compared supertest v7 / superagent v10 `mime` import with Jest `moduleNameMapper` shim in `jest.config.js`.

### How AI Helped
Diagnosed version mismatch between `mime` 1.x (Express) and 2.x (superagent). Rewrote `test-support/mime-shim.cjs` to expose `getType` regardless of installed version.

### What I Validated
`cd src/backend && npm run test:integration` — 80/80 tests pass.

### Final Fix
Robust Jest shim mapping `^mime$` → `test-support/mime-shim.cjs`.

---

## Issue 9: React `act(...)` warnings in frontend tests

**Session:** Post-submission frontend test cleanup (2026-07-15)

### Problem
Vitest passed but stderr showed `act(...)` warnings on async form submits in `UsersPage` and `RolesPage` tests.

### How I Investigated
Traced warnings to `setSubmitting` / `setSaving` state updates resolving outside `act` after mocked API calls.

### How AI Helped
Applied deferred promise pattern: mock API hangs until resolved inside `act(async () => { click; resolve(); })`. Adjusted page components to reset submitting state only on error path.

### What I Validated
`cd src/frontend && npm test` — 23 tests pass, zero `act` warnings.

### Final Fix
Test pattern in `UsersPage.test.tsx` / `RolesPage.test.tsx`; component submit handlers in `UsersPage.tsx` / `RolesPage.tsx`.
