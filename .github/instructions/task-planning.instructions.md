---
description: "Use when planning tasks, breaking down features, analyzing requirements, or creating implementation plans. Guides structured task planning and execution workflow."
---
# Task Planning Instructions

## Planning Workflow
1. **Understand the Requirement** — Read the full ticket/requirement before planning
2. **Identify Scope** — Determine what's in scope and what's out of scope
3. **Break Down** — Split into small, independently deliverable tasks
4. **Identify Dependencies** — Map what depends on what
5. **Estimate Complexity** — Rate each task: small / medium / large
6. **Plan Execution Order** — Sequence tasks respecting dependencies
7. **Present for Approval** — WAIT for confirmation before executing

## Task Breakdown Rules
- Each task should be completable in one session
- Tasks should have clear acceptance criteria
- Include both implementation AND testing in the plan
- Identify files to create, modify, or delete
- Note any required database migrations
- Flag potential risks or blockers

## Plan Format
```markdown
## Summary
[1-2 sentence overview of the change]

## Tasks
1. [ ] [Task description] — [files affected] — [size: S/M/L]
2. [ ] [Task description] — [files affected] — [size: S/M/L]
...

## Dependencies
- Task 2 depends on Task 1
- Task 4 depends on Task 3

## Risks & Considerations
- [Risk 1 and mitigation]
- [Risk 2 and mitigation]

## Out of Scope
- [Things explicitly NOT being done]
```

## After Approval
- Execute tasks in planned order
- Mark each task complete as you finish
- If you discover new requirements during execution, pause and re-plan
- Verify each task passes tests before moving on
- Do NOT add unplanned features or refactoring

## When Requirements Are Unclear
- List specific questions that need answers
- Propose assumptions with explicit call-outs
- Suggest minimal viable approach vs full approach
- Never guess on business logic — always ask
