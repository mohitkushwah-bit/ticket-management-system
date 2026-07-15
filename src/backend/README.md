# Backend — Ticket Management System

Node.js/Express REST API with TypeScript, PostgreSQL, and JWT authentication.

## Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server (requires PostgreSQL running)
npm run dev
```

Server runs at `http://localhost:3001`. Swagger docs at `http://localhost:3001/api-docs`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled production build |
| `npm test` | Run tests |
| `npm run test:integration` | Run integration tests |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── config/         # Environment, database, swagger config
├── controllers/    # Request handlers
├── middleware/     # Auth, authorization, validation, error handling
├── models/         # TypeScript interfaces and types
├── repositories/   # Database queries
├── routes/         # Express route definitions + validation schemas
└── services/       # Business logic
database/
├── migrations/     # SQL schema (001_initial_schema.sql)
└── seeds/            # Seed data

Tests live in repository-root `tests/backend/`.
```

## API Endpoints

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | /api/auth/login | No | — |
| GET | /api/auth/me | Yes | Any |
| PATCH | /api/auth/me | Yes | Any |
| GET | /api/tickets | Yes | Any |
| POST | /api/tickets | Yes | admin, user |
| GET | /api/tickets/:id | Yes | Any |
| PATCH | /api/tickets/:id | Yes | admin, user |
| PATCH | /api/tickets/:id/status | Yes | admin, user |
| GET | /api/tickets/:id/comments | Yes | Any |
| POST | /api/tickets/:id/comments | Yes | admin, user |
| GET | /api/users | Yes | Any |
| POST | /api/users | Yes | admin |
| PATCH | /api/users/:id | Yes | admin |
| DELETE | /api/users/:id | Yes | admin |
| GET | /api/roles | Yes | admin |
| POST | /api/roles | Yes | admin |
| PATCH | /api/roles/:id | Yes | admin |
| DELETE | /api/roles/:id | Yes | admin |

## Environment Variables

See [.env.example](.env.example) for all required variables.
