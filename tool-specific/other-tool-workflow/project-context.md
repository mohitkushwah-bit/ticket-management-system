# Project Context — How AI is Given Context

Evidence from `.copilot-sessions/` and the implemented `.github/` customization layer. Primary tool: **GitHub Copilot (Claude)** in VS Code custom agent mode.

## Primary Tool

GitHub Copilot with Claude model, custom agent mode with file edit, terminal, and search tools. All prompts logged to `.copilot-sessions/prompts_YYYY-MM-DD.log` via hooks (setup prompt 2026-07-06 10:46).

## Context Mechanism

### 1. Global Instructions (`.github/copilot-instructions.md`)

Always-on project guidelines:
- Tech stack: React, Node.js, PostgreSQL, Docker
- Plan-first workflow (STOP before implementing)
- Architecture: Controller → Service → Repository
- Build/test commands for `src/backend/` and `src/frontend/`
- Security: never hardcode secrets
- Accessibility requirements

### 2. File-Specific Instructions (`.github/instructions/`)

Auto-loaded by `applyTo` pattern:

| Instruction | Triggers On |
|-------------|-------------|
| `coding-standards.instructions.md` | `**/*.{ts,tsx,js,jsx}` |
| `solid-principles.instructions.md` | `**/*.{ts,tsx,js,jsx}` |
| `integration-tests.instructions.md` | `**/*.{test,spec}.{ts,tsx}` |
| `design-system.instructions.md` | `**/*.{tsx,jsx,css,scss}` |
| `accessibility.instructions.md` | `**/*.{tsx,jsx}` |
| `documentation.instructions.md` | `**/*.md` |
| `confidential-info.instructions.md` | `**` (always) |
| `task-planning.instructions.md` | On-demand |
| `agents-best-practices.instructions.md` | On-demand |

### 3. Skills (`.github/skills/`)

| Skill | Used for (session evidence) |
|-------|----------------------------|
| `senior-developer` | `/build-feature` implementation passes |
| `qa-engineer` | Integration test generation (07-10) |
| `task-planner` | `/plan-and-execute` (07-06) |
| `tech-lead-reviewer` | `review the code` (07-10) |
| `security-expert` | 16-file security audit (07-10) |
| `debugging-expert` | Vite crypto, tracingChannel errors |
| `business-analyst` | Requirements analysis (07-06) |
| `documentation-specialist` | Submission artifacts |

### 4. Custom Agents (`.github/agents/`)

| Agent | Session usage |
|-------|---------------|
| `@task-planner` | Part A/B division, requirements (07-06) |
| `@review` | Full codebase review (07-10 14:09) |
| `@security` | Security audit + fixes (07-10 14:41) |
| `@testing` | State machine + CRUD tests (07-10 14:58) |
| `@fix-error` | Node/Vite runtime errors (07-06, 07-10) |
| `@optimization` | Performance passes (07-10 12:25, 13:58) |
| `@ai-workflow` | Part A documentation generation |

### 5. Prompts (`.github/prompts/`)

| Prompt | Session usage |
|--------|---------------|
| `/plan-and-execute` | Initial implementation plan (07-06 15:03) |
| `/build-feature` | Edit ticket, auth, roles, filters (07-07–09) |
| `/find-bugs` | Bug/security scan (07-10 14:30) |
| `/explain-code` | Dummy hash evaluation (07-10 14:53) |
| `/format-and-cleanup` | 60+ file cleanup (07-10 15:38) |

### 6. Hooks (`.github/hooks/`)

| Hook | Purpose |
|------|---------|
| `session-history.json` | Logs prompts → `.copilot-sessions/prompts_*.log` |
| `documentation.json` | Reminds to update README after source edits |
| `context-cache.json` | Caches context between sessions |

Scripts: `scripts/hooks/log-prompt.sh`, `log-response.sh`, `cache-context.sh`

### 7. Prompt History (`.copilot-sessions/`)

| File pattern | Contents |
|--------------|----------|
| `prompts_YYYY-MM-DD.log` | Timestamped prompts and responses |
| `tools_YYYY-MM-DD.log` | Tool call traces |
| `raw_YYYY-MM-DD.jsonl` | Raw JSON payloads |
| `session_YYYY-MM-DD_*.md` | Session transcripts |
| `prompt-history.log` (root) | Merged cross-session history |

## How Context Flows

```
User prompt
  → copilot-instructions.md (always)
  → Matching instructions (applyTo)
  → Relevant skills (description match)
  → Agent persona (@agent) or prompt template (/prompt)
  → Tool results (file reads, searches, terminal)
  → Response
  → Hooks log to .copilot-sessions/
```

## Stack-Specific Context Examples

Research prompts in sessions explicitly listed files to read before implementing:

**Auth (07-08):** Read `routes/index.ts`, `middleware/`, `database/migrations/001_initial_schema.sql`, `Layout.tsx`, `App.tsx`, both `package.json` files.

**RBAC (07-09):** Read `user.repository.ts`, `auth.ts`, `AuthContext.tsx`, `types.ts`, `UsersPage.tsx` before `role_id` migration.

**Security (07-10):** Read 16 specific security-relevant files before audit.

**Optimization (07-10):** Read ALL files in `repositories/`, `services/`, `pages/`, `components/` before performance recommendations.

## What Is NOT Shared with AI

Enforced by `confidential-info.instructions.md`:
- Real API keys, tokens, passwords
- Real database connection strings
- PII beyond synthetic seed data
- `.env` files (gitignored; only `.env.example` with placeholders in repo)

## Current Codebase Map (for AI context)

| Area | Path | Files |
|------|------|-------|
| Backend API | `src/backend/src/` | 31 TypeScript files |
| Frontend UI | `src/frontend/src/` | 10 pages, 15+ components |
| Database | `database/` | 1 migration, 1 seed |
| Tests | `tests/` | 5 backend suites + 1 frontend test |
| Docs | repository root | 20+ submission markdown files |

## Traceability to Implementation

```
.copilot-sessions/prompts_2026-07-06.log (requirements + plan)
  → src/backend/src/ + src/frontend/src/ (implementation)
  → tests/backend/ (verification)
  → .copilot-sessions/prompts_2026-07-10.log (review + security + tests)
  → code-review-notes.md, review-fixes.md, reflection.md
```
