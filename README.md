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
| [candidate-info.md](candidate-info.md) | Candidate details + **AI tool: GitHub Copilot (Claude)** |
| [tool-workflow.md](tool-workflow.md) | AI workflow foundation (Part A) — **start here for AI evidence** |
| [final-ai-usage-summary.md](final-ai-usage-summary.md) | Lifecycle prompt summary with artifact traceability |
| [ai-prompts/](ai-prompts/) | Grouped prompt history + `prompt-history/` session logs |
| [requirements-analysis.md](requirements-analysis.md) | Requirement analysis + edge cases |
| [acceptance-criteria.md](acceptance-criteria.md) | Given/When/Then acceptance checklist |
| [design-notes.md](design-notes.md) | Architecture and design trade-offs |
| [api-contract.md](api-contract.md) | REST API contract |
| [test-strategy.md](test-strategy.md) | Test scope, FE/BE coverage |
| [debugging-notes.md](debugging-notes.md) | Debugging walkthroughs with AI assistance |
| [code-review-notes.md](code-review-notes.md) | AI-assisted review findings |
| [pr-description.md](pr-description.md) | PR summary linking requirements → code |
| [reflection.md](reflection.md) | Honest AI usage reflection |

See `screenshots.pdf` for UI screenshots.

**Note:** `.env` files contain placeholder values only. Do not commit real credentials.
