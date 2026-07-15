# AI Prompts — Code Review

Evidence from `.copilot-sessions/prompts_2026-07-10.log` and `prompt-history.log`.

---

## Prompt 1: Full codebase review

**Prompt (2026-07-10, 14:09):** `review the code`

Follow-up research prompt asked AI to read all files under `backend/src/` and `frontend/src/`, plus test files and `docker-compose.yml`, returning complete source for review.

**AI Response:** Read-only review across both apps; findings grouped by severity (Critical / Major / Minor / Nit). Identified validation gaps, inconsistent error handling, and missing security middleware.

**Accepted:** Issue list used as input for remediation pass at 14:22.  
**Changed:** Scoped later passes to security-relevant files only (14:41).  
**Rejected:** Direct code modification during `@review` session — review agent is read-only by design.

**Codebase outcome:** Review informed fixes in `src/backend/src/middleware/error-handler.ts`, route validation, and frontend error display patterns.

---

## Prompt 2: Bug and security scan

**Prompt (2026-07-10, 14:30):** `/find-bugs Find the possible bugs, code smells and security concerns`

Research pass read all of `backend/src/`, `frontend/src/`, `backend/tests/`, and `backend/database/migrations/`.

**AI Response:** Flagged missing `helmet()`, permissive CORS, no rate limiting, Swagger exposed in all environments, and generic frontend error messages.

**Accepted:** Findings fed into `fix the above issues` (14:36) and security audit (14:41).  
**Changed:** —  
**Rejected:** —

**Codebase outcome:** Gaps documented in `code-review-notes.md`; remediated in `src/backend/src/app.ts`.

---

## Prompt 3: Targeted security audit

**Prompt (2026-07-10, 14:41):** `check for security concerns, and the possible solution`

Follow-up listed 16 specific files: `app.ts`, `package.json`, `config/env.ts`, `config/database.ts`, all middleware, auth routes, user/comment repositories, `frontend/src/services/api.ts`, `docker-compose.yml`, `.env.example`, `role.routes.ts`.

**AI Response:** Detailed per-file findings with remediation steps for CORS, headers, body limits, rate limiting, and production Swagger exposure.

**Accepted:** `helmet()`, configurable `ALLOWED_ORIGINS`, `express.json({ limit: '10kb' })`, `express-rate-limit`, Swagger gated to non-production.  
**Changed:** Swagger disabled when `env.nodeEnv === 'production'` in `src/backend/src/app.ts`.  
**Rejected:** Dummy bcrypt hash on failed login (see Prompt 4).

**Codebase evidence:**

```1:43:src/backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// ...
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
if (env.nodeEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { ... }));
}
```

---

## Prompt 4: Dummy hash discussion and rejection

**Prompt (2026-07-10, 14:53):** `/explain-code why we need dummy hash`  
**Prompt (2026-07-10, 14:56):** `remove the dummy hash fix`

**AI Response:** Explained timing-attack mitigation via constant-time comparison with a dummy hash when user is not found.

**Accepted:** Understanding of the pattern.  
**Changed:** —  
**Rejected:** Implementation — removed from `src/backend/src/services/auth.service.ts` as disproportionate for assessment scope.

---

## Prompt 5: Format and cleanup

**Prompt (2026-07-10, 15:38–15:45):** `/format-and-cleanup all the code files`

Two-phase approach: read-only analysis of all 31 backend + 30+ frontend source files, then apply fixes.

**AI Response:** Reported unused imports, dead code, and import ordering issues; then applied cleanup.

**Accepted:** Read-only analysis before edits; import ordering standardized.  
**Changed:** Limited scope to cleanup only — no broad refactors.  
**Rejected:** Re-flagging exports as unused without cross-file usage check.

**Codebase outcome:** Documented in `review-fixes.md` under Code Quality Fixes.

---

## Prompt 6: Performance review (pre-review context)

**Prompt (2026-07-10, 12:25–14:07):** `optimize the code` + scoped second pass listing 12 already-applied optimizations.

**AI Response:** Identified `React.lazy`, `useMemo`/`useCallback`, `React.memo`, debounced search, `COUNT(*) OVER()` window query.

**Accepted:** All performance items in `review-fixes.md`.  
**Changed:** Developer listed already-fixed items in follow-up prompt to prevent duplicate reports.  
**Rejected:** —
