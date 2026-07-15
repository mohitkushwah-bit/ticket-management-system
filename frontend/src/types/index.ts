export type UserRole = 'admin' | 'agent' | 'user';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
export type ScreenName = 'dashboard' | 'tickets' | 'kanban' | 'users' | 'roles';

export interface ScreenAccess {
  read: boolean;
  write: boolean;
}

export type RolePermissions = Record<ScreenName, ScreenAccess>;

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: RolePermissions;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string | null;
  prLink: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export interface ApiErrorResponse {
  errors: ApiError[];
}

// State machine: valid transitions map (mirrors backend)
export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
