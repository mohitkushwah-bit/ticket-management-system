# Candidate Information

**Name:** Mohit Kushwah  
**Role:** Full-Stack Developer  
**Primary Technology Stack:** React, TypeScript, Node.js, Express, PostgreSQL, Docker

**Primary AI Tool Used:** GitHub Copilot (**Claude** model) in VS Code custom agent mode  
**Evidence:** `tool-workflow.md`, `ai-prompts/prompt-history/`, `.copilot-sessions/`, `final-ai-usage-summary.md`

**Assessment Start Date:** 2026-07-06  
**Submission Date:** 2026-07-15

## Project Summary

A full-stack internal support ticket management system where users create, search, filter, comment on, and progress tickets through a strict status state machine. The implementation includes JWT authentication, role-based access control, a Kanban drag-and-drop board, user/role administration, Swagger API docs, and Docker Compose deployment.

## Tools Used

| Tool | Purpose |
|------|---------|
| GitHub Copilot (Claude) | Code generation, planning, testing, review, debugging |
| VS Code Custom Agents | `@task-planner`, `@testing`, `@review`, `@fix-error`, `@security` |
| Docker Compose | PostgreSQL + backend + frontend orchestration |
| Jest + Supertest | Backend integration tests |
| Vitest + RTL | Frontend component tests |

## Setup Summary

1. Copy `src/backend/.env.example` → `src/backend/.env` and `src/frontend/.env.example` → `src/frontend/.env`
2. Run `docker-compose up -d` from repository root
3. Access frontend at `http://localhost:5173`, API at `http://localhost:3001`, Swagger at `http://localhost:3001/api-docs`
4. Run backend tests: `cd src/backend && npm run test:integration`
5. Run frontend tests: `cd src/frontend && npm test`
