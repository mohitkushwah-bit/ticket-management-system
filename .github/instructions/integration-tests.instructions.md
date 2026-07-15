---
description: "Use when writing integration tests, end-to-end tests, or API tests. Covers test structure, database setup, mocking strategies, and assertion patterns."
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---
# Integration Test Instructions

## Test Structure
```
describe('[Module/Feature]', () => {
  describe('[Endpoint/Method]', () => {
    it('should [expected behavior] when [condition]', () => {});
  });
});
```

## Integration Test Principles
- Test real interactions between components (no mocking internal layers)
- Use a dedicated test database (never production)
- Each test should be independent — setup and teardown in beforeEach/afterEach
- Test the happy path AND error paths
- Assert on response status, body structure, and side effects

## Database Testing
- Use transactions with rollback for test isolation
- Seed minimum required data per test
- Use factories/fixtures for test data creation
- Clean up in `afterEach` or use transaction rollback
- Test database migrations separately

## API Integration Tests
```typescript
describe('POST /api/tickets', () => {
  it('should create a ticket and return 201', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ title: 'Bug fix', priority: 'high' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Bug fix');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${testToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({ title: 'Bug fix' });

    expect(response.status).toBe(401);
  });
});
```

## What to Test
- CRUD operations for each entity
- Authentication and authorization
- Input validation and error responses
- Edge cases (empty data, max limits, special characters)
- Concurrent operations and race conditions
- Pagination, filtering, and sorting

## Test Naming Convention
- `should [do something] when [condition]`
- Be specific: "should return 404 when ticket does not exist"
- NOT vague: "should work correctly"

## Test Environment
- Use `.env.test` for test-specific configuration
- Use in-memory database or Docker container for tests
- Mock external services (email, payment, third-party APIs)
- Never make real HTTP calls to external services
