# Support Ticket Management System

A full-stack internal support ticket management application with a React frontend, Node.js/Express backend, and PostgreSQL database.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, @dnd-kit |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | PostgreSQL 16 |
| Containerization | Docker + docker-compose |

## Quick Start

### Prerequisites

- Docker & Docker Compose

### 1. Configure Environment

```bash
cp src/backend/.env.example src/backend/.env
cp src/frontend/.env.example src/frontend/.env
```

### 2. Start All Services

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** at `:5432` (creates schema + seeds data automatically)
- **Backend API** at `http://localhost:3001` (Swagger docs at `/api-docs`)
- **Frontend** at `http://localhost:5173`

### 3. Start Database Only

```bash
docker-compose up db -d
```

Then run backend/frontend locally:
- [Backend README](src/backend/README.md)
- [Frontend README](src/frontend/README.md)

### Stop Services

```bash
docker-compose down
```

## Repository Structure (Submission Layout)

```
ticket-management-system/
├── README.md
├── candidate-info.md
├── tool-workflow.md
├── requirements-analysis.md
├── acceptance-criteria.md
├── implementation-plan.md
├── design-notes.md
├── api-contract.md
├── data-model.md
├── ui-flow.md
├── test-strategy.md
├── test-results.md
├── debugging-notes.md
├── code-review-notes.md
├── review-fixes.md
├── pr-description.md
├── reflection.md
├── final-ai-usage-summary.md
├── src/
│   ├── frontend/          # React application
│   └── backend/           # Node.js API
├── tests/
│   ├── backend/           # Jest integration tests
│   └── frontend/          # Vitest component tests
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── setup-notes.md
├── ai-prompts/            # Grouped prompt history
└── tool-specific/
    └── other-tool-workflow/
```

## Running Tests

```bash
# Backend integration tests (requires PostgreSQL)
cd src/backend && npm run test:integration

# Frontend tests
cd src/frontend && npm test
```

## Status State Machine

```
Open → In Progress → Resolved → Closed
Open → Cancelled
In Progress → Cancelled
```

## Submission Artifacts

| Document | Description |
|----------|-------------|
| [tool-workflow.md](tool-workflow.md) | AI workflow foundation (Part A) |
| [requirements-analysis.md](requirements-analysis.md) | Requirement analysis |
| [design-notes.md](design-notes.md) | Architecture and design decisions |
| [api-contract.md](api-contract.md) | REST API contract |
| [ai-prompts/](ai-prompts/) | Grouped AI prompt history |

See `screenshots.pdf` for UI screenshots.

**Note:** `.env` files contain placeholder values only. Do not commit real credentials.
