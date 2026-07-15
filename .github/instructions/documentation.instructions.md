---
description: "Use when creating, updating, or reviewing README files, API documentation, changelogs, or any reference documentation."
applyTo: "**/*.md"
---
# Documentation Instructions

## README Structure
Every module/package should have a README with:
1. **Title** — Clear name of the module
2. **Description** — What it does and why it exists (1-2 sentences)
3. **Prerequisites** — Required tools, versions, environment setup
4. **Installation** — Step-by-step setup commands
5. **Usage** — Code examples or CLI commands
6. **API Reference** — Key endpoints, methods, or interfaces
7. **Configuration** — Environment variables and options
8. **Testing** — How to run tests
9. **Contributing** — Guidelines for contributing

## Documentation Standards
- Write in present tense, active voice
- Use code blocks with language identifiers for all code examples
- Keep sentences short and scannable
- Use tables for structured data (env vars, API params)
- Include curl examples for API endpoints
- Document error responses alongside success responses

## When to Update Documentation
- New module or feature added
- API contract changes (new/modified/removed endpoints)
- Configuration or environment variable changes
- Breaking changes or migrations
- New dependencies added

## Changelog Format
Follow [Keep a Changelog](https://keepachangelog.com/) format:
```markdown
## [version] - YYYY-MM-DD
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```

## API Documentation
- Document request/response schemas with TypeScript interfaces
- Include authentication requirements
- Provide example requests and responses
- Document rate limits and pagination
- List possible error codes and meanings
