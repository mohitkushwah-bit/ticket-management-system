# Project Context — How AI is Given Context

## Primary Tool
GitHub Copilot (Claude) running inside VS Code with custom agent mode.

## Context Mechanism

### 1. Global Instructions (`.github/copilot-instructions.md`)
Always-on project guidelines loaded into every interaction:
- Tech stack definition (React, Node.js, PostgreSQL, Docker)
- Plan-first workflow enforcement
- Code style rules (TypeScript strict, functional components, async/await)
- Architecture pattern (Controller → Service → Repository)
- Build/test commands
- Security rules (never hardcode secrets)
- Accessibility requirements

### 2. File-Specific Instructions (`.github/instructions/`)
Auto-loaded based on file type being edited:
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
On-demand domain expertise loaded when relevant:
- `senior-developer` — Full-stack React/Node/Postgres/Docker
- `qa-engineer` — Integration testing specialist
- `documentation-specialist` — Technical writing
- `tech-lead-reviewer` — Code review & optimization
- `business-analyst` — Requirement translation
- `debugging-expert` — Error diagnosis
- `security-expert` — AppSec engineering
- `task-planner` — Implementation planning

### 4. Custom Agents (`.github/agents/`)
Specialized personas with restricted tool access:
- `@task-planner` — Requirement analysis → implementation plan
- `@review` — Code quality review
- `@security` — Vulnerability scanning
- `@testing` — Integration test generation
- `@fix-error` — Complex error resolution
- `@optimization` — Performance improvement
- `@root-cause` — Git forensics
- `@address-pr-comments` — PR feedback resolution
- `@ai-workflow` — Part A documentation generation

### 5. Hooks (`.github/hooks/`)
Lifecycle automation:
- **UserPromptSubmit** → Logs every prompt to `.copilot-sessions/`
- **PostToolUse** → Logs tool usage to separate trace file
- **Stop** → Saves session summary and caches context

### 6. Prompt History (`.copilot-sessions/`)
Full audit trail of all AI interactions:
- `prompts_YYYY-MM-DD.log` — Human-readable prompt/response log
- `tools_YYYY-MM-DD.log` — Tool call traces
- `raw_YYYY-MM-DD.jsonl` — Raw JSON payloads for analysis

## How Context Flows
```
User prompt
  → copilot-instructions.md (always loaded)
  → Matching instructions via applyTo patterns
  → Relevant skills via description matching
  → Agent persona (if invoked via @agent)
  → Prompt template (if invoked via /prompt)
  → Tool results (file reads, searches, terminal output)
  → Response generated with full context
  → Hooks fire (log prompt, log tools, cache context)
```
