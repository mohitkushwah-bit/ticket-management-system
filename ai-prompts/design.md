# AI Prompts — Design

## Prompt 1: Architecture design

**Prompt:** Design layered architecture for React + Express + PostgreSQL ticket system with state machine.

**AI Response:** Proposed Controller → Service → Repository backend, Pages → Components → Services frontend, centralized state machine module.

**Accepted:** Layered architecture, single source of truth for transitions in `state-machine.ts`.  
**Changed:** Added JSONB role permissions instead of hardcoded-only RBAC.  
**Rejected:** DB-trigger-only state machine (chose service-layer for testability).

---

## Prompt 2: Kanban board design

**Prompt:** Add Jira-like drag-and-drop Kanban with state machine enforcement on drop.

**AI Response:** `@dnd-kit` columns per status, API call on drop, snap-back on 422.

**Accepted:** KanbanBoard component with column-per-status layout.  
**Changed:** Highlight valid drop targets during drag.  
**Rejected:** Client-only status change without API call.

---

## Prompt 3: API contract design

**Prompt:** Design REST endpoints for tickets, comments, auth with validation rules.

**AI Response:** RESTful routes, dedicated `PATCH /tickets/:id/status`, Zod schemas, structured error format.

**Accepted:** Endpoint structure documented in `api-contract.md`.  
**Changed:** Added stats endpoints for dashboard.  
**Rejected:** —
