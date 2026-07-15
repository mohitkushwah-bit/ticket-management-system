// ============================================
// Entity Types
// ============================================

export type UserRole = 'admin' | 'agent' | 'user';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface AdminUpdateUserDto {
  name?: string;
  email?: string;
  roleId?: string;
  password?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions: RolePermissions;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: RolePermissions;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdBy: string;
  createdAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedTo?: string | null;
  prLink?: string | null;
  createdBy: string;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: string | null;
  prLink?: string | null;
}

export interface ChangeStatusDto {
  status: TicketStatus;
}

export interface CreateCommentDto {
  message: string;
  createdBy: string;
}

export interface TicketWithComments extends Ticket {
  comments: Comment[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TicketSortBy = 'createdAt' | 'updatedAt' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TicketFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  sortBy?: TicketSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export interface ApiErrorResponse {
  errors: ApiError[];
}

// ============================================
// Auth Types
// ============================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
