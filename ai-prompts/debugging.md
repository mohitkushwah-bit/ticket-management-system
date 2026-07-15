# AI Prompts — Debugging

## Prompt 1: Node.js dependency error

**Prompt:** `fix the error` — TypeError: tracingChannel is not a function in lru-cache.

**AI Response:** Diagnosed Node.js version incompatibility; suggested Node 20 and clean install.

**Accepted:** Node 20 in Dockerfile and local dev.  
**Changed:** —  
**Rejected:** —

---

## Prompt 2: Database path restructuring

**Prompt:** Merge migration files; move database folder; update all broken paths.

**AI Response:** Single `001_initial_schema.sql`, updated docker-compose, README, test setup paths.

**Accepted:** Consolidated migration and path updates.  
**Changed:** Later moved `database/` to repository root for submission layout.  
**Rejected:** —

---

## Prompt 3: Search debounce

**Prompt:** Search is firing API on every keystroke — fix performance.

**AI Response:** 300ms debounce in SearchFilter component.

**Accepted:** Debounced search handler.  
**Changed:** —  
**Rejected:** —

---

## Prompt 4: Dummy hash explanation

**Prompt:** `/explain-code` — why do we need dummy hash for login?

**AI Response:** Explained timing attack mitigation via constant-time comparison.

**Accepted:** Understanding of the pattern.  
**Changed:** —  
**Rejected:** Implementation — removed as over-engineered for scope.
