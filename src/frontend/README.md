# Frontend — Ticket Management System

React 18 SPA with TypeScript, Vite, and role-based access control.

## Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev
```

App runs at `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to dist/ |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest tests (`tests/frontend/`) |

## Project Structure

```
src/
├── components/     # Reusable UI components (common/, Layout, Modals)
├── context/        # React contexts (Auth, Toast)
├── hooks/          # Custom hooks (useRole)
├── pages/          # Route pages (Dashboard, Tickets, Kanban, Users, Roles)
├── services/       # API client and service modules
├── styles/         # Global CSS
└── types/          # TypeScript type definitions
```

## Features

- **Dashboard** — Ticket statistics and charts
- **Ticket List** — Paginated, searchable, filterable ticket table
- **Kanban Board** — Drag-and-drop ticket status management
- **Ticket Detail** — View, edit, status transitions, comments
- **User Management** — Admin CRUD for users (role assignment)
- **Role Management** — Admin CRUD for roles with screen permissions matrix
- **Authentication** — JWT login with protected routes
- **RBAC** — Admin (full), User (read/write tickets), Agent (read-only)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |
