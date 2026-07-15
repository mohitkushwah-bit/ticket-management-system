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
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
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

Then run backend/frontend locally — see their respective READMEs:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

### Stop Services

```bash
docker-compose down
```

## Project Structure

```
ticket-management-system/
├── frontend/           # React application
├── backend/            # Node.js API + database migrations
├── docker-compose.yml  # Container orchestration
└── README.md
```

## Status State Machine

```
Open → In Progress → Resolved → Closed
Open → Cancelled
In Progress → Cancelled
```

## screenshots.pdf file has been attached to get a glimpse of the screens.

### Note: .env files only contains dummy values and placeholders. They have been pushed only to provide a structure of .env file and variables. Add these files to .gitignore later.