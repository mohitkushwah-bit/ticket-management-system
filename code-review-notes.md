# Code Review Notes

## AI-Assisted Review Summary

Multiple review passes using `@review`, `/find-bugs`, and explicit security audit prompts (session 2026-07-10):

1. **General code review** — architecture alignment, error handling, type safety
2. **Bug scan** — `/find-bugs` proactive scan across backend and frontend
3. **Security audit** — 16-file targeted review (auth, CORS, helmet, env, SQL)
4. **Performance review** — memoization, lazy loading, query consolidation
5. **Cleanup pass** — `/format-and-cleanup` read-only analysis then import ordering fixes

## My Review Observations

| Area | Finding | Severity |
|------|---------|----------|
| State machine | Correctly centralized; integration tests comprehensive | — |
| SQL queries | All parameterized; no string concatenation | — |
| Auth middleware | Applied consistently on protected routes | — |
| CORS | Initially permissive; hardened to `ALLOWED_ORIGINS` | Major |
| Rate limiting | Missing initially; added `express-rate-limit` | Major |
| Helmet | Missing initially; added for security headers | Major |
| Swagger | Exposed in all environments initially; gated to non-production | Minor |
| Frontend perf | Missing memoization on Kanban; addressed in optimization pass | Minor |

## Changes Made After Review

- Added `helmet()`, configurable CORS, body size limits, rate limiting
- Disabled Swagger in production
- Added `useMemo`/`useCallback`/`React.memo` in hot paths
- Debounced search input (300ms)
- Consolidated ticket count query with window function
- Import ordering and dead code cleanup across 50+ files

## Suggestions Rejected (and why)

| Suggestion | Reason |
|------------|--------|
| Dummy bcrypt hash on failed login | Over-engineered for scope; rejected after `/explain-code` review |
| Full E2E test suite with Playwright | Integration tests cover critical rules; E2E deferred |
| Server-side session store instead of JWT | JWT fits SPA architecture; stateless simpler for monorepo |
