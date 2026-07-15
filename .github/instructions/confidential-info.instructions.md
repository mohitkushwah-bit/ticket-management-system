---
description: "Use when writing code, generating responses, or handling configuration. CRITICAL: Prevents sharing confidential information, secrets, PII, or sensitive data in code, commits, prompts, or outputs."
applyTo: "**"
---
# Confidential Information Protection

## NEVER Include in Code or Responses
- API keys, tokens, secrets, or passwords
- Database connection strings with credentials
- Private keys, certificates, or signing keys
- Personal Identifiable Information (PII): names, emails, phone numbers, addresses
- Internal URLs, IP addresses, or infrastructure details
- Client names, project names, or business-sensitive data
- License keys or proprietary algorithms
- Employee information or organizational charts

## Code Rules
- Use environment variables for ALL sensitive configuration
- Use `.env.example` with placeholder values (never real values)
- Add `.env`, `.env.local`, `.env.*.local` to `.gitignore`
- Use secret management tools (Vault, AWS Secrets Manager) in production
- Never log sensitive data (mask tokens, redact PII in logs)

## Git Protection
- Review diffs before committing — check for leaked secrets
- Use git hooks (pre-commit) to scan for secrets
- If a secret is accidentally committed, rotate it immediately (don't just remove from history)
- Use `.gitignore` for all environment files, key files, and credential stores

## During AI Interactions
- Do NOT paste real credentials into prompts
- Use placeholder values: `YOUR_API_KEY_HERE`, `<token>`, `***`
- Do NOT include real customer data in examples
- Use synthetic/mock data for demonstrations
- Never reference internal systems by real hostname/IP

## Response Generation
- When generating config examples, always use placeholders
- When showing database queries, use generic sample data
- Never generate real-looking API keys or tokens
- Sanitize any file content before including in responses

## Patterns for Secrets
```typescript
// GOOD
const dbHost = process.env.DB_HOST;
const apiKey = process.env.API_KEY;

// BAD - NEVER DO THIS
const dbHost = 'prod-db.internal.company.com';
const apiKey = 'sk-abc123...';
```

## Files That Must Be in .gitignore
```
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
credentials.json
serviceAccount.json
```
