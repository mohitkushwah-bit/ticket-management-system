# AI Prompts — Planning

## Prompt 1: Initial requirement breakdown

**Prompt:** Read requirement document. Divide into Part A (AI Workflow Foundation) and Part B (ticket management requirements markdown). Use required skills.

**AI Response:** Proposed structured approach with `@task-planner` for requirements and `@ai-workflow` agent for Part A artifacts.

**Accepted:** Two-part task division and skill/agent mapping.  
**Changed:** Expanded requirements with PR link field, integration tests, Kanban drag-and-drop.  
**Rejected:** —

---

## Prompt 2: Implementation task plan

**Prompt:** `/plan-and-execute` — create phased implementation plan for ticket management system.

**AI Response:** 38 tasks across 6 phases with S/M/L sizing, dependency map, critical path through state machine tests.

**Accepted:** Phase structure and critical path `DB → schema → ticket service → state machine → API → tests`.  
**Changed:** Added stretch phases for auth, Docker, Swagger.  
**Rejected:** —

---

## Prompt 3: Repository restructuring

**Prompt:** Restructure code per submission document (`src/`, `tests/`, `database/`, required markdown artifacts).

**AI Response:** Move `frontend/` → `src/frontend/`, `backend/` → `src/backend/`, extract `database/` and `tests/`, update configs.

**Accepted:** Directory moves and path updates in docker-compose, jest, vitest.  
**Changed:** Created all submission markdown files at repository root.  
**Rejected:** —
