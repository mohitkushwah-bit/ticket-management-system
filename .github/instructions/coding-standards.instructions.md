---
description: "Use when writing or reviewing code. Enforces best coding practices including clean code, performance optimization, error handling, and TypeScript best practices."
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# Best Coding Standards & Optimization

## Clean Code
- Use meaningful, descriptive variable and function names
- Keep functions under 20 lines where possible
- Maximum 3 parameters per function; use objects for more
- Avoid magic numbers — use named constants
- No commented-out code in production
- Early returns over nested conditionals

## TypeScript Best Practices
- Enable strict mode (`strict: true` in tsconfig)
- Use explicit return types on exported functions
- Prefer `unknown` over `any`; avoid `any` entirely
- Use discriminated unions for complex state
- Leverage `readonly` for immutable data
- Use `as const` for literal types

## Performance Optimization
- Memoize expensive computations (`useMemo`, `useCallback` in React)
- Avoid unnecessary re-renders (React.memo for pure components)
- Use pagination for large datasets
- Implement database indexing for frequent queries
- Use connection pooling for database connections
- Lazy load modules and components where appropriate
- Debounce/throttle expensive event handlers

## Error Handling
- Use custom error classes with meaningful messages
- Handle errors at appropriate boundaries (controller level for HTTP)
- Never swallow errors silently
- Log errors with context (request ID, user ID, stack trace)
- Return consistent error response formats from APIs

## Async Patterns
- Always use async/await over .then() chains
- Handle promise rejections explicitly
- Use `Promise.all()` for independent parallel operations
- Implement proper timeout handling for external calls
- Use abort controllers for cancellable requests

## Code Organization
- One export per file for classes/components
- Group imports: external → internal → relative
- Co-locate tests with source files or in parallel `__tests__` directories
- Keep barrel exports (`index.ts`) minimal to avoid circular dependencies
