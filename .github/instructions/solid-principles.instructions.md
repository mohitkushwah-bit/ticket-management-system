---
description: "Use when generating or refactoring code. Enforces SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion."
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# SOLID Principles

Apply these principles when writing or refactoring code:

## Single Responsibility Principle (SRP)
- Each class/module/function should have ONE reason to change
- Split files that handle multiple concerns (e.g., data fetching + rendering + validation)
- Services should do one thing well

## Open/Closed Principle (OCP)
- Classes should be open for extension, closed for modification
- Use interfaces and abstract classes for extensibility
- Prefer composition over inheritance
- Use strategy pattern for varying behavior

## Liskov Substitution Principle (LSP)
- Subtypes must be substitutable for their base types without altering correctness
- Don't override methods to throw exceptions or no-op
- Ensure derived classes honor the contracts of their parents

## Interface Segregation Principle (ISP)
- Prefer many small, specific interfaces over one large interface
- Clients should not be forced to depend on methods they don't use
- Split fat interfaces into role-based interfaces

## Dependency Inversion Principle (DIP)
- High-level modules should not depend on low-level modules; both should depend on abstractions
- Use dependency injection (constructor injection preferred)
- Program to interfaces, not implementations

## Examples

```typescript
// BAD: God class
class TicketService {
  createTicket() { /* ... */ }
  sendEmail() { /* ... */ }
  generateReport() { /* ... */ }
}

// GOOD: Single responsibility
class TicketService { createTicket() { /* ... */ } }
class NotificationService { sendEmail() { /* ... */ } }
class ReportService { generateReport() { /* ... */ } }
```

```typescript
// GOOD: Dependency Inversion
interface ITicketRepository {
  findById(id: string): Promise<Ticket>;
  save(ticket: Ticket): Promise<Ticket>;
}

class TicketService {
  constructor(private readonly repo: ITicketRepository) {}
}
```
