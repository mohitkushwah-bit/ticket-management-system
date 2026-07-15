# API Contract

Base URL: `http://localhost:3001/api`  
Auth: `Authorization: Bearer <JWT>` on protected routes

Error format: `{ "errors": [{ "message": string, "field"?: string }] }`

---

## Auth

### Login
- **Method:** POST
- **Path:** `/auth/login`
- **Purpose:** Authenticate user and receive JWT

**Request:**
```json
{ "email": "alice@example.com", "password": "password123" }
```

**Response (200):**
```json
{ "data": { "token": "<jwt>", "user": { "userId": "...", "email": "...", "role": "admin" } } }
```

**Validation:** email required, password required  
**Errors:** 401 invalid credentials

### Get Current User
- **Method:** GET | **Path:** `/auth/me` | **Auth:** Yes

---

## Tickets

### Create Ticket
- **Method:** POST | **Path:** `/tickets` | **Auth:** admin, user

**Request:**
```json
{
  "title": "Login page broken",
  "description": "Users cannot reset password",
  "priority": "high",
  "assignedTo": "uuid-or-null",
  "prLink": "https://github.com/org/repo/pull/1"
}
```

**Response (201):** `{ "data": { /* ticket */ } }`  
**Validation:** title, description, priority required; prLink must be valid URL if provided  
**Errors:** 400/422 validation, 401/403 auth

### List Tickets
- **Method:** GET | **Path:** `/tickets` | **Auth:** Yes

**Query:** `?search=&status=&priority=&page=&limit=&sortBy=&sortOrder=`

**Response (200):**
```json
{ "data": [/* tickets */], "meta": { "total": 42, "page": 1, "limit": 10 } }
```

### Get Ticket
- **Method:** GET | **Path:** `/tickets/:id` | **Auth:** Yes  
**Response (200):** ticket with comments  
**Errors:** 404 not found

### Update Ticket
- **Method:** PATCH | **Path:** `/tickets/:id` | **Auth:** admin, user

**Request:** partial `{ title?, description?, priority?, assignedTo?, prLink? }`  
**Response (200):** updated ticket

### Change Status
- **Method:** PATCH | **Path:** `/tickets/:id/status` | **Auth:** admin, user

**Request:**
```json
{ "status": "in_progress" }
```

**Response (200):** updated ticket  
**Validation:** status must be valid transition from current state  
**Errors:** 422 invalid transition with allowed next statuses; 409 concurrent update

---

## Comments

### List Comments
- **Method:** GET | **Path:** `/tickets/:id/comments` | **Auth:** Yes

### Add Comment
- **Method:** POST | **Path:** `/tickets/:id/comments` | **Auth:** admin, user

**Request:** `{ "message": "Investigating now" }`  
**Validation:** message required, non-empty  
**Errors:** 404 ticket not found; 400/422 empty message

---

## Users & Roles (Admin)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/users` | List users (assignee dropdown) |
| POST | `/users` | Create user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/roles` | List roles |
| POST/PATCH/DELETE | `/roles/:id` | Role CRUD |

---

## Health

- **GET** `/health` → `{ "status": "ok", "timestamp": "..." }`

Full interactive docs: `http://localhost:3001/api-docs` (non-production)
