---
description: "Use when creating or configuring custom agents, prompts, skills, or hooks. Best practices for GitHub Copilot agent customizations."
---
# Agent Best Practices

## Agent Design Principles
- Each agent should have a single, well-defined purpose
- Use minimal tool sets — only grant tools the agent needs
- Write keyword-rich descriptions for discoverability
- Keep agent instructions focused and actionable

## Tool Restrictions
- Read-only agents: `tools: [read, search]`
- Research agents: `tools: [read, search, web]`
- Code modification agents: `tools: [read, edit, search, execute]`
- Never give `execute` to agents that don't need terminal access

## Subagent Patterns
- Use subagents for context isolation
- Parent agents should orchestrate, not do the work
- Subagents return a single output — design for composability
- Set `user-invocable: false` for utility subagents

## Instruction Design
- One concern per instruction file
- Use `applyTo` for file-type-specific rules
- Use `description` for task-based discovery
- Keep instructions concise — agents have limited context windows

## Prompt Design
- One task per prompt
- Include expected output format
- Reference existing instruction files instead of duplicating
- Use `argument-hint` to guide user input

## Hook Design
- Keep hooks fast (under 15s timeout)
- Use exit code 2 for blocking errors
- Validate inputs from stdin
- Never hardcode secrets in hook scripts

## Common Anti-Patterns
- Agents with vague descriptions that never get invoked
- Overly broad `applyTo: "**"` on specialized instructions
- Multi-purpose agents that try to do everything
- Hooks that silently fail without logging
