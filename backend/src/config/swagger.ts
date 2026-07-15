const swaggerSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Ticket Management System API',
      version: '1.0.0',
      description: 'REST API for the Support Ticket Management System. Provides endpoints for authentication, ticket CRUD, user management, and role-based access control.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API base path',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        // === Auth ===
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                user: { $ref: '#/components/schemas/AuthUser' },
              },
            },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'John Admin' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', example: 'admin' },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'New Name' },
            email: { type: 'string', format: 'email' },
            currentPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
          },
        },

        // === Users ===
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', format: 'email' },
            roleId: { type: 'string', format: 'uuid' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'roleId'],
          properties: {
            name: { type: 'string', example: 'New User' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            roleId: { type: 'string', format: 'uuid' },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            roleId: { type: 'string', format: 'uuid' },
            password: { type: 'string', minLength: 6 },
          },
        },

        // === Roles ===
        ScreenAccess: {
          type: 'object',
          required: ['read', 'write'],
          properties: {
            read: { type: 'boolean' },
            write: { type: 'boolean' },
          },
        },
        RolePermissions: {
          type: 'object',
          required: ['dashboard', 'tickets', 'kanban', 'users', 'roles'],
          properties: {
            dashboard: { $ref: '#/components/schemas/ScreenAccess' },
            tickets: { $ref: '#/components/schemas/ScreenAccess' },
            kanban: { $ref: '#/components/schemas/ScreenAccess' },
            users: { $ref: '#/components/schemas/ScreenAccess' },
            roles: { $ref: '#/components/schemas/ScreenAccess' },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'admin' },
            description: { type: 'string', nullable: true },
            permissions: { $ref: '#/components/schemas/RolePermissions' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateRoleRequest: {
          type: 'object',
          required: ['name', 'permissions'],
          properties: {
            name: { type: 'string', maxLength: 50, example: 'manager' },
            description: { type: 'string', maxLength: 255 },
            permissions: { $ref: '#/components/schemas/RolePermissions' },
          },
        },
        UpdateRoleRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', maxLength: 50 },
            description: { type: 'string', maxLength: 255 },
            permissions: { $ref: '#/components/schemas/RolePermissions' },
          },
        },

        // === Tickets ===
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Fix login bug' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed', 'cancelled'] },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            prLink: { type: 'string', format: 'uri', nullable: true },
            createdBy: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTicketRequest: {
          type: 'object',
          required: ['title', 'description', 'priority', 'createdBy'],
          properties: {
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            prLink: { type: 'string', format: 'uri', nullable: true },
            createdBy: { type: 'string', format: 'uuid' },
          },
        },
        UpdateTicketRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            prLink: { type: 'string', format: 'uri', nullable: true },
          },
        },
        ChangeStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed', 'cancelled'] },
          },
        },

        // === Comments ===
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            ticketId: { type: 'string', format: 'uuid' },
            message: { type: 'string' },
            createdBy: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCommentRequest: {
          type: 'object',
          required: ['message', 'createdBy'],
          properties: {
            message: { type: 'string' },
            createdBy: { type: 'string', format: 'uuid' },
          },
        },

        // === Common ===
        ErrorResponse: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  field: { type: 'string' },
                  code: { type: 'string' },
                },
                required: ['message'],
              },
            },
          },
        },
        PaginatedTickets: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } },
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    paths: {
      // ==========================================
      // AUTH
      // ==========================================
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          description: 'Authenticate with email and password to receive a JWT token.',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          description: 'Returns the authenticated user profile.',
          responses: {
            '200': { description: 'Success', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/AuthUser' } } } } } },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        patch: {
          tags: ['Auth'],
          summary: 'Update profile',
          description: 'Update the current user\'s name, email, or password.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } },
          },
          responses: {
            '200': { description: 'Profile updated', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/AuthUser' } } } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
      },

      // ==========================================
      // TICKETS
      // ==========================================
      '/tickets': {
        get: {
          tags: ['Tickets'],
          summary: 'List tickets',
          description: 'Get paginated, filterable, sortable list of tickets.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title and description' },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed', 'cancelled'] } },
            { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] } },
            { name: 'assignedTo', in: 'query', schema: { type: 'string', format: 'uuid' } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'priority', 'title'], default: 'createdAt' } },
            { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          ],
          responses: {
            '200': { description: 'Paginated ticket list', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedTickets' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Tickets'],
          summary: 'Create ticket',
          description: 'Create a new support ticket. Requires admin or user role.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTicketRequest' } } },
          },
          responses: {
            '201': { description: 'Ticket created', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Ticket' } } } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Forbidden — agent role cannot create tickets' },
          },
        },
      },
      '/tickets/stats/status-counts': {
        get: {
          tags: ['Tickets'],
          summary: 'Get status counts',
          description: 'Returns count of tickets grouped by status.',
          responses: {
            '200': {
              description: 'Status counts',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            status: { type: 'string' },
                            count: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/tickets/stats/resolved': {
        get: {
          tags: ['Tickets'],
          summary: 'Get resolved tickets by period',
          description: 'Returns count of tickets resolved grouped by time period.',
          parameters: [
            { name: 'period', in: 'query', schema: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'daily' } },
          ],
          responses: {
            '200': { description: 'Resolved counts by period' },
          },
        },
      },
      '/tickets/{id}': {
        get: {
          tags: ['Tickets'],
          summary: 'Get ticket by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Ticket details', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Ticket' } } } } } },
            '404': { description: 'Ticket not found' },
          },
        },
        patch: {
          tags: ['Tickets'],
          summary: 'Update ticket',
          description: 'Update ticket fields. Requires admin or user role.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTicketRequest' } } },
          },
          responses: {
            '200': { description: 'Ticket updated', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Ticket' } } } } } },
            '400': { description: 'Validation error' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
      },
      '/tickets/{id}/status': {
        patch: {
          tags: ['Tickets'],
          summary: 'Change ticket status',
          description: 'Transition a ticket to a new status. Requires admin or user role. Validates valid status transitions.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangeStatusRequest' } } },
          },
          responses: {
            '200': { description: 'Status updated', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Ticket' } } } } } },
            '400': { description: 'Invalid status transition' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
      },
      '/tickets/{id}/comments': {
        get: {
          tags: ['Comments'],
          summary: 'List comments for a ticket',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'List of comments', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } } } },
          },
        },
        post: {
          tags: ['Comments'],
          summary: 'Add a comment',
          description: 'Add a comment to a ticket. Requires admin or user role.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCommentRequest' } } },
          },
          responses: {
            '201': { description: 'Comment created', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Comment' } } } } } },
            '400': { description: 'Validation error' },
            '403': { description: 'Forbidden' },
          },
        },
      },

      // ==========================================
      // USERS
      // ==========================================
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'List all users',
          description: 'Returns all users. Available to all authenticated users (used for assignee dropdowns).',
          responses: {
            '200': { description: 'User list', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } } },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Create user (admin only)',
          description: 'Create a new user. Requires admin role.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } } },
          },
          responses: {
            '201': { description: 'User created', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/User' } } } } } },
            '400': { description: 'Validation error (e.g. email in use)' },
            '403': { description: 'Forbidden — admin only' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'User details', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/User' } } } } } },
            '404': { description: 'User not found' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user (admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } },
          },
          responses: {
            '200': { description: 'User updated', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/User' } } } } } },
            '400': { description: 'Validation error' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user (admin only)',
          description: 'Delete a user. Fails if the user has tickets assigned (created_by). Requires admin role.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '204': { description: 'User deleted' },
            '400': { description: 'Cannot delete — user has tickets' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
      },

      // ==========================================
      // ROLES
      // ==========================================
      '/roles': {
        get: {
          tags: ['Roles'],
          summary: 'List all roles (admin only)',
          responses: {
            '200': { description: 'Role list', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Role' } } } } } } },
            '403': { description: 'Forbidden' },
          },
        },
        post: {
          tags: ['Roles'],
          summary: 'Create role (admin only)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRoleRequest' } } },
          },
          responses: {
            '201': { description: 'Role created', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Role' } } } } } },
            '400': { description: 'Validation error (e.g. name exists)' },
            '403': { description: 'Forbidden' },
          },
        },
      },
      '/roles/{id}': {
        get: {
          tags: ['Roles'],
          summary: 'Get role by ID (admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Role details', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Role' } } } } } },
            '404': { description: 'Not found' },
          },
        },
        patch: {
          tags: ['Roles'],
          summary: 'Update role (admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateRoleRequest' } } },
          },
          responses: {
            '200': { description: 'Role updated', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Role' } } } } } },
            '400': { description: 'Validation error' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Roles'],
          summary: 'Delete role (admin only)',
          description: 'Delete a custom role. Built-in roles (admin, agent, user) cannot be deleted. Fails if users are assigned this role.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '204': { description: 'Role deleted' },
            '400': { description: 'Cannot delete — built-in role or users assigned' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Not found' },
          },
        },
      },

      // ==========================================
      // HEALTH
      // ==========================================
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          security: [],
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication and profile management' },
      { name: 'Tickets', description: 'Support ticket CRUD operations' },
      { name: 'Comments', description: 'Ticket comments' },
      { name: 'Users', description: 'User management (admin)' },
      { name: 'Roles', description: 'Role and permissions management (admin)' },
      { name: 'System', description: 'System health and status' },
    ],
};

export { swaggerSpec };
