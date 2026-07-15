# AI Workflow Foundation — Part A

Evidence-based documentation of how GitHub Copilot (Claude) was used to build the Ticket Management System. Every section cites actual repository artifacts.

---

## 1. Primary AI Tool Used

**Tool:** GitHub Copilot with **Claude** model in VS Code  
**Mode:** Custom agent mode with full tool access (file edit, terminal, search)

**Evidence:**
- `tool-specific/other-tool-workflow/project-context.md` — documents Copilot as primary tool
- `tool-specific/other-tool-workflow/tool-usage-notes.md` — configuration details
- `.copilot-sessions/prompts_2026-07-10.log` — 40+ logged prompts from a single development day

---

## 2. How You Provide Project Context

Context is delivered through a layered `.github/` customization structure:

### Global Instructions (always loaded)
`.github/copilot-instructions.md` — tech stack, plan-first workflow, architecture pattern (Controller → Service → Repository), build/test commands, security rules, accessibility requirements.

### File-Specific Instructions (auto-loaded by `applyTo`)
| File | Triggers On |
|------|-------------|
| `instructions/coding-standards.instructions.md` | `**/*.{ts,tsx,js,jsx}` |
| `instructions/solid-principles.instructions.md` | `**/*.{ts,tsx,js,jsx}` |
| `instructions/integration-tests.instructions.md` | `**/*.{test,spec}.{ts,tsx}` |
| `instructions/design-system.instructions.md` | `**/*.{tsx,jsx,css,scss}` |
| `instructions/accessibility.instructions.md` | `**/*.{tsx,jsx}` |
| `instructions/confidential-info.instructions.md` | `**` (all files) |

### On-Demand Context
- **8 skills** in `.github/skills/` (senior-developer, qa-engineer, task-planner, etc.)
- **9 agents** in `.github/agents/` (invoked via `@agent-name`)
- **7 prompts** in `.github/prompts/` (invoked via `/prompt-name`)

### Lifecycle Hooks
`.github/hooks/session-history.json` — logs every prompt to `.copilot-sessions/`  
`.github/hooks/documentation.json` — reminds to update README after source edits

**Context flow** (from `tool-specific/other-tool-workflow/project-context.md`):
```
User prompt → copilot-instructions.md → matching instructions → skills → agent → tools → response → hooks log
```

---

## 3. How You Use AI for Requirement Analysis

**Agent:** `@task-planner` (`.github/agents/task-planner.agent.md`)  
**Skill:** `business-analyst` (`.github/skills/business-analyst/SKILL.md`)

**Process:**
1. Paste or reference the requirement document
2. Invoke `@task-planner` to analyze scope, entities, and acceptance criteria
3. Output structured into `tool-specific/other-tool-workflow/requirements.md`

**Evidence:**
- `tool-specific/other-tool-workflow/requirements.md` — full specification with data model, state machine, API design, acceptance criteria table
- `tool-specific/other-tool-workflow/spec.md` — condensed summary referencing requirements
- `tool-specific/other-tool-workflow/acceptance-criteria.md` — Given/When/Then criteria derived from requirements

**Human validation:** Review state machine transition rules and acceptance criteria completeness before implementation begins.

---

## 4. How You Use AI for Planning and Design

**Prompt:** `/plan-and-execute` (`.github/prompts/plan-and-execute.prompt.md`)  
**Instructions:** `task-planning.instructions.md`  
**Skill:** `task-planner`

**Process:**
1. AI produces a structured plan (files, dependencies, risks, test plan)
2. **STOP** — wait for developer approval
3. Execute only after confirmation

**Evidence:**
- `tool-specific/other-tool-workflow/tasks.md` — 38 tasks across 6 phases with S/M/L sizing and dependency map
- Critical path: `DB setup → schema → ticket service → state machine → API → state-machine tests`
- `.github/copilot-instructions.md` lines 10–22 — plan-first workflow enforcement

**Design decisions documented in:** `tool-specific/other-tool-workflow/design.md` (architecture, state machine, RBAC, security, frontend design system).

**Example from session log:** Database restructuring planned and executed sequentially (11:54 merge migrations → 11:57 move to backend → 11:58 update paths).

---

## 5. How You Use AI for Code Generation

**Prompt:** `/build-feature` (`.github/prompts/build-feature.prompt.md`)  
**Skill:** `senior-developer` (`.github/skills/senior-developer/SKILL.md`)  
**Guardrails:** `coding-standards.instructions.md` + `solid-principles.instructions.md`

**Process:**
1. Plan presented with files to create/modify
2. AI implements layer-by-layer: migration → repository → service → controller → route → frontend component
3. Follows layered architecture and TypeScript strict mode

**Evidence — generated code:**
| Layer | Key Files |
|-------|-----------|
| State machine | `backend/src/models/state-machine.ts` |
| Business logic | `backend/src/services/ticket.service.ts` |
| API routes | `backend/src/routes/ticket.routes.ts` |
| Auth | `backend/src/middleware/auth.ts`, `authorize.ts` |
| Frontend routes | `frontend/src/App.tsx` (lazy-loaded pages) |
| Kanban UI | `frontend/src/components/KanbanBoard.tsx` |
| API client | `frontend/src/services/api.ts` (JWT interceptors) |
| Design system | `frontend/src/components/common/`, `styles/variables.css` |

**Session examples:**
- 11:29 — *"Create swagger documentation for the backend API"* → `backend/src/config/swagger.ts`
- 12:01 — *"create separate Readme.md, .gitignore, .env for backend and frontend"*
- 12:18 — *"update docker-compose file to use environment variables from .env files"*

---

## 6. How You Validate AI-Generated Code

**Agents:** `@review` + `@security`  
**Skills:** `tech-lead-reviewer`, `security-expert`  
**Tests:** Backend integration test suite

**Validation workflow:**
1. `@review` — read-only code review (correctness, architecture, performance)
2. `/find-bugs` — proactive bug and security scan
3. Security audit — explicit file list review (session 14:41)
4. Run `npm run test:integration` — automated verification
5. Fix issues → re-review

**Evidence from session log:**
| Time | Action | Result |
|------|--------|--------|
| 14:09 | `review the code` | Full codebase read for review |
| 14:22 | `fix the issues` | Remediation pass |
| 14:30 | `/find-bugs` | Bug and security scan |
| 14:36 | `fix the above issues` | Second remediation |
| 14:41 | Security audit (16 files) | Identified CORS, helmet, rate limit gaps |
| 14:47 | `implement the solution for each security issue` | Applied fixes |
| 15:07 | `verify every test pass` | Test verification |

**Review output format** (from `review.agent.md`): findings by severity (Critical/Major/Minor/Nit), with blocking vs nice-to-have distinction.

---

## 7. How You Use AI for Testing

**Agent:** `@testing` (`.github/agents/testing.agent.md`)  
**Skill:** `qa-engineer` (`.github/skills/qa-engineer/SKILL.md`)  
**Instructions:** `integration-tests.instructions.md`

**Rules enforced:**
- `describe/it` with `should [behavior] when [condition]` naming
- AAA pattern (Arrange, Act, Assert)
- No mocking internal layers in integration tests
- Dedicated test database with global setup/teardown

**Evidence — test suites:**
| File | Coverage |
|------|----------|
| `backend/tests/state-machine.test.ts` | All valid/invalid transitions (mandatory) |
| `backend/tests/tickets.test.ts` | CRUD, search, filter, pagination |
| `backend/tests/comments.test.ts` | Create, list, validation errors |
| `backend/tests/users.test.ts` | User CRUD |
| `backend/tests/roles.test.ts` | Role CRUD |
| `frontend/src/pages/EditTicketPage.test.tsx` | Form component test |

**Session evidence:**
- 14:58 — *"Run all tests for frontend and backend, also add tests for roles and user crud"*
- 15:07 — *"Run all tests for frontend and backend, and verify every test pass"*

**Run commands:** `npm test` (backend), `npm run test:integration` (backend integration), `npm test` (frontend Vitest).

---

## 8. How You Use AI for Debugging

**Agents:** `@fix-error`, `@root-cause`  
**Skill:** `debugging-expert` (`.github/skills/debugging-expert/SKILL.md`)  
**Prompt:** `/find-bugs`

**Approach** (from `fix-error.agent.md`):
1. Reproduce → Isolate → Diagnose root cause → Minimal fix → Verify → Prevent

**Evidence from session log:**

| Time | Issue | Resolution |
|------|-------|------------|
| 11:37 | `TypeError: tracingChannel is not a function` in lru-cache | Node.js / dependency compatibility fix |
| 11:54 | Multiple migration files | Merged into `001_initial_schema.sql` |
| 11:57 | Database folder location | Moved to `backend/database/` |
| 11:58 | Broken paths after move | Updated docker-compose, READMEs, configs |
| 13:52 | Search not debounced | Added 300ms debounce to `SearchFilter` |
| 14:53 | Dummy hash question | Explained, then removed per developer decision |

**Hooks** log all debug sessions to `.copilot-sessions/prompts_YYYY-MM-DD.log` for post-hoc analysis.

---

## 9. How You Use AI for Code Review

**Agents:** `@review`, `@optimization`, `@address-pr-comments`  
**Skills:** `tech-lead-reviewer`, `security-expert`  
**Prompts:** `/find-bugs`, `/format-and-cleanup`

**Review passes documented in session log:**

1. **Code review** (14:09) — full source read, issues identified
2. **Bug fix** (14:22, 14:36) — two remediation iterations
3. **Security review** (14:41–14:51) — targeted 16-file audit + implementation
4. **Performance review** (12:25–14:07) — two optimization passes with explicit scope
5. **Cleanup review** (15:38–15:45) — read-only analysis of all backend + frontend files for unused imports, dead code, import ordering

**Review agent constraint:** DO NOT modify code directly — only provide feedback. This prevents accidental changes during review.

**PR workflow:** `@address-pr-comments` agent processes reviewer feedback; `/create-pull-request` prompt generates PR description from git diff.

---

## 10. What Information You Avoid Sharing

**Enforced by:** `confidential-info.instructions.md` (`applyTo: "**"` — all files)

**Rules:**
- No real API keys, tokens, passwords, or credentials
- No real database connection strings
- No PII (names, emails, phone numbers)
- No internal URLs or IP addresses
- Use placeholders: `YOUR_API_KEY_HERE`, `<token>`

**Repository protections:**
- `.gitignore` excludes `.env`, `.env.local`, `*.pem`, `*.key`
- `backend/.env.example` and `frontend/.env.example` contain placeholder values only
- Seed data uses synthetic test users, not real PII

**During AI interactions:** Developers do not paste real credentials into prompts. Session log shows only code paths and error messages, no secrets.

---

## 11. How You Would Reuse This Workflow

The entire `.github/` customization structure is **portable** to any new project:

### Step 1: Copy the Framework
```
.github/
├── copilot-instructions.md      # Adjust tech stack
├── instructions/                 # Keep or modify applyTo patterns
├── agents/                       # Reuse all 9 agents
├── skills/                       # Reuse all 8 skills
├── prompts/                      # Reuse all 7 prompts
└── hooks/                        # Reuse hook configs
scripts/hooks/                    # Copy logging scripts
```

### Step 2: Customize for New Project
1. Update `copilot-instructions.md` with new tech stack and conventions
2. Adjust `design-system.instructions.md` for new UI framework
3. Modify `integration-tests.instructions.md` for new test framework
4. Create project-specific `tool-specific/other-tool-workflow/requirements.md`

### Step 3: Set Up Evidence Trail
1. Ensure `.gitignore` includes `.copilot-sessions/` (local audit, not committed)
2. Hooks auto-log all prompts for reflection and traceability
3. Generate `tool-specific/other-tool-workflow/` artifacts per project

### Step 4: Follow the SDLC Loop
```
@task-planner → /plan-and-execute → /build-feature → @testing → @review → @security → /create-pull-request
```

### What Transfers Directly
- All 9 agents (task-planner, review, testing, fix-error, security, optimization, root-cause, address-pr-comments, ai-workflow)
- All 8 skills
- All 7 prompts
- Hook-based logging infrastructure
- Plan-first workflow enforcement

### What Must Be Project-Specific
- `tool-specific/other-tool-workflowocs/requirements.md` — business rules
- `tool-specific/other-tool-workflow//design.md` — architecture decisions
- `tool-specific/other-tool-workflow/tasks.md` — implementation plan
- Source code and tests

---

## Traceability Chain

```
tool-specific/other-tool-workflow/requirements.md
  → tool-specific/other-tool-workflow/tasks.md
    → backend/src/ + frontend/src/ (implementation)
      → backend/tests/ (verification)
        → @review + @security (quality gates)
          → /create-pull-request (PR artifact)
            → tool-specific/other-tool-workflow/reflection.md + tool-workflow.md (this document)
```

---

## Artifact Index

| Artifact | Path | SDLC Phase |
|----------|------|------------|
| Requirements | `tool-specific/other-tool-workflow/requirements.md` | Analysis |
| Design notes | `tool-specific/other-tool-workflow/design.md` | Design |
| Task plan | `tool-specific/other-tool-workflow/tasks.md` | Planning |
| Acceptance criteria | `tool-specific/other-tool-workflow/acceptance-criteria.md` | Validation |
| Project context | `tool-specific/other-tool-workflow/project-context.md` | Meta |
| Tool usage notes | `tool-specific/other-tool-workflow/tool-usage-notes.md` | Reflection |
| AI reflection | `tool-specific/other-tool-workflow/reflection.md` | Reflection |
| Prompt history | `.copilot-sessions/prompts_*.log` | Audit trail |
| Copilot config | `.github/` (37 files) | All phases |
| This document | `tool-workflow.md` | Part A deliverable |

---