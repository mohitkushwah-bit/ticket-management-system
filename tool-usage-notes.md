# Tool Usage Notes — GitHub Copilot (Claude)

## Tool Configuration

### Primary Tool
- **GitHub Copilot** with **Claude** model in VS Code
- Running in custom agent mode with full tool access (file edit, terminal, search, web)

### Customization Layer
The project uses a comprehensive `.github/` customization structure:
- **9 instruction files** — file-type-specific coding standards
- **9 custom agents** — specialized personas for different SDLC phases
- **7 prompt files** — reusable task templates
- **3 hook configurations** — lifecycle automation (logging, documentation reminders, context caching)
- **8 skill files** — domain expertise loaded on-demand

---

## Usage Patterns Across SDLC

### 1. Requirement Analysis
- **How**: Paste requirement document → invoke `@task-planner` agent
- **What it does**: Breaks requirements into entities, features, acceptance criteria, and phased tasks
- **Output**: `docs/requirements.md` with structured specification
- **Human validation**: Review acceptance criteria for completeness, verify state machine rules

### 2. Planning & Design
- **How**: Use `/plan-and-execute` prompt with feature description
- **What it does**: Produces file list, dependency map, and execution order
- **Output**: Structured plan with phases, sizes, and dependencies
- **Human validation**: Review plan for feasibility, adjust sizes, confirm approach

### 3. Code Generation
- **How**: Use `/build-feature` prompt or direct conversation with senior-developer skill
- **What it does**: Generates TypeScript code following project conventions (layered architecture, SOLID)
- **Guardrails**: coding-standards + solid-principles instructions auto-applied to all TS/TSX files
- **Human validation**: Review generated code, run linter, verify it follows patterns

### 4. Validation of AI Code
- **How**: Invoke `@review` agent on changed files, then `@security` agent
- **What it does**: Reviews for correctness, architecture adherence, performance, and security
- **Guardrails**: Review agent has read-only tools (can't modify, only report)
- **Human action**: Address findings, re-run review until clean

### 5. Testing
- **How**: Invoke `@testing` agent with source files as context
- **What it does**: Generates integration tests following project test patterns
- **Guardrails**: integration-tests.instructions.md enforces AAA pattern, naming conventions, isolation
- **Human validation**: Run tests, verify they test meaningful behavior (not just coverage)

### 6. Debugging
- **How**: Invoke `@fix-error` with error message/stack trace, or `@root-cause` for git forensics
- **What it does**: Diagnoses root cause, proposes minimal fix, verifies fix works
- **Human validation**: Confirm fix addresses root cause (not symptom), run regression tests

### 7. Code Review
- **How**: Invoke `@review` + `@optimization` agents on PR-ready code
- **What it does**: Reports findings by severity (Critical/Major/Minor/Nit)
- **Distinguishes**: Blocking issues vs nice-to-haves
- **Human action**: Address blocking issues, decide on nits

---

## What We Avoid Sharing

Enforced by `confidential-info.instructions.md` (applied to ALL files):
- No real API keys, tokens, or credentials
- No real database connection strings
- No PII (names, emails, phone numbers)
- No internal URLs or IP addresses
- No client-specific business data
- Use placeholder values in all examples: `YOUR_API_KEY_HERE`, `<token>`

---

## Evidence & Traceability

### Prompt History
All interactions are logged automatically via hooks:
- `UserPromptSubmit` → logs prompt text to `.copilot-sessions/prompts_YYYY-MM-DD.log`
- `PostToolUse` → logs tool calls to `.copilot-sessions/tools_YYYY-MM-DD.log`
- `Stop` → saves session summary
- Raw JSON preserved in `.copilot-sessions/raw_YYYY-MM-DD.jsonl`

### Traceability Chain
```
Requirement (docs/requirements.md)
  → Task Plan (tool-specific/other-tool-workflow/tasks.md)
    → Implementation (source code)
      → Tests (backend/tests/)
        → Review (via @review agent)
          → PR Description
```

---

## Lessons Learned

1. **Context is everything** — The more structured context (instructions, skills) you give the AI, the more consistent and useful its output becomes.
2. **Plan before code** — The plan-first workflow catches design issues before implementation begins.
3. **Agents enforce roles** — Restricting tools per agent (read-only for review) prevents accidental changes.
4. **Hooks provide auditability** — Automatic logging means you never lose prompt history.
5. **Validate at boundaries** — AI-generated code needs human review at system boundaries (auth, validation, state machines).

---

## Reusability

The entire `.github/` customization structure is **portable**:
- Copy to any new project
- Adjust `copilot-instructions.md` for new tech stack
- Skills and agents work across projects
- Hooks provide consistent logging everywhere
- Instructions enforce standards without manual enforcement
