import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Priority must be one of: low, medium, high, critical' }),
  }),
  assignedTo: z.string().uuid('Invalid user ID').nullable().optional(),
  prLink: z
    .string()
    .url('PR link must be a valid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  createdBy: z.string().uuid('Invalid user ID'),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'], {
      errorMap: () => ({ message: 'Priority must be one of: low, medium, high, critical' }),
    })
    .optional(),
  assignedTo: z.string().uuid('Invalid user ID').nullable().optional(),
  prLink: z
    .string()
    .url('PR link must be a valid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
});

export const changeStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed', 'cancelled'], {
    errorMap: () => ({
      message: 'Status must be one of: open, in_progress, resolved, closed, cancelled',
    }),
  }),
});

export const createCommentSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  createdBy: z.string().uuid('Invalid user ID'),
});

// ============================================
// Role Schemas
// ============================================

const screenAccessSchema = z.object({
  read: z.boolean(),
  write: z.boolean(),
});

const permissionsSchema = z.object({
  dashboard: screenAccessSchema,
  tickets: screenAccessSchema,
  kanban: screenAccessSchema,
  users: screenAccessSchema,
  roles: screenAccessSchema,
});

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  description: z.string().max(255).optional(),
  permissions: permissionsSchema,
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less').optional(),
  description: z.string().max(255).optional(),
  permissions: permissionsSchema.optional(),
});

// ============================================
// Shared password schema
// ============================================

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

// ============================================
// User Schemas
// ============================================

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  roleId: z.string().uuid('Invalid role ID'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: passwordSchema.optional(),
  roleId: z.string().uuid('Invalid role ID').optional(),
});
