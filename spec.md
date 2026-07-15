# Specification — Support Ticket Management System

## Overview
A full-stack web application for managing internal support tickets. Users create, update, comment on, search, and progress tickets through a defined status lifecycle.

## Tech Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express/NestJS
- **Database**: PostgreSQL
- **Infrastructure**: Docker, GitHub Actions CI/CD

## Core Entities
- **User**: id, name, email, role (admin/agent/user) — seeded data
- **Ticket**: id, title, description, priority, status, assignedTo, createdBy, timestamps
- **Comment**: id, ticketId, message, createdBy, createdAt

## Key Feature: Status State Machine
```
Open → In Progress → Resolved → Closed
Open → Cancelled
In Progress → Cancelled
```
All other transitions are invalid and must be rejected.

## Core Scope (Mandatory)
1. Ticket CRUD (create, list, view, update)
2. Status transitions with state machine enforcement
3. Comments on tickets
4. Keyword search + status filter
5. PostgreSQL persistence with migrations and seed data
6. Backend input validation
7. Frontend error handling
8. Integration tests for state machine rules

## Stretch Scope (Optional)
- Authentication (JWT, RBAC, protected routes)
- Additional entities (Tag, Attachment)
- Advanced filtering (priority, assignee, pagination, sorting)
- Unit tests and edge-case tests
- Swagger API documentation
- Docker setup with docker-compose
- CI/CD pipeline

## Full Specification
See [`docs/requirements.md`](../../docs/requirements.md) for complete data model, API design, acceptance criteria, and repository structure.
