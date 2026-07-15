# Project Guidelines — Ticket Management System

## Tech Stack
- **Frontend**: React.js (TypeScript)
- **Backend**: Node.js (Express/NestJS)
- **Database**: PostgreSQL
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Workflow: Plan First, Execute After Approval

**ALWAYS follow this workflow for any task:**

1. **Understand** — Read the requirements/ticket thoroughly. Ask clarifying questions if ambiguous.
2. **Plan** — Produce a structured plan with:
   - Summary of changes
   - Files to create/modify
   - Dependencies or risks
   - Estimated scope (small / medium / large)
3. **Wait for Approval** — Present the plan and WAIT for user confirmation before writing code.
4. **Execute** — Implement only after approval. Follow the plan step-by-step.
5. **Verify** — Run tests and validate the implementation matches the plan.

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks (React)
- Use async/await over raw promises
- Follow SOLID principles (see instructions/solid-principles)
- Keep functions small and single-purpose

## Architecture
- Layered architecture: Controller → Service → Repository
- Separate business logic from framework code
- Use dependency injection
- Keep API contracts in shared types

## Build and Test
```bash
# Install dependencies
npm install

# Run development
npm run dev

# Run tests
npm test

# Run integration tests
npm run test:integration

# Build for production
npm run build

# Docker
docker-compose up -d
```

## Conventions
- File naming: kebab-case for files, PascalCase for components/classes
- API routes: RESTful, plural nouns (`/api/tickets`, `/api/users`)
- Environment variables: prefixed with app context (e.g., `DB_HOST`, `JWT_SECRET`)
- Git commits: conventional commits format (`feat:`, `fix:`, `chore:`, `docs:`)

## Security
- NEVER hardcode secrets, API keys, tokens, or passwords in source code
- Use environment variables or secret management for all sensitive data
- Validate and sanitize all user inputs
- Use parameterized queries — never concatenate SQL strings
- Apply principle of least privilege

## Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Provide ARIA labels where necessary
- Maintain color contrast ratios (WCAG 2.1 AA minimum)
