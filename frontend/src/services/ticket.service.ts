import api from './api';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  PaginatedResponse,
} from '../types';

export type TicketSortBy = 'createdAt' | 'updatedAt' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

interface TicketFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  sortBy?: TicketSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedTo?: string | null;
  prLink?: string | null;
  createdBy: string;
}

interface UpdateTicketPayload {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: string | null;
  prLink?: string | null;
}

export const ticketService = {
  async getAll(filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const response = await api.get<PaginatedResponse<Ticket>>(`/tickets?${params}`);
    return response.data;
  },

  async getById(id: string): Promise<Ticket> {
    const response = await api.get<{ data: Ticket }>(`/tickets/${id}`);
    return response.data.data;
  },

  async create(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await api.post<{ data: Ticket }>('/tickets', payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateTicketPayload): Promise<Ticket> {
    const response = await api.patch<{ data: Ticket }>(`/tickets/${id}`, payload);
    return response.data.data;
  },

  async changeStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const response = await api.patch<{ data: Ticket }>(`/tickets/${id}/status`, { status });
    return response.data.data;
  },

  async getStatusCounts(): Promise<Record<TicketStatus, number>> {
    const response = await api.get<{ data: Record<TicketStatus, number> }>('/tickets/stats/status-counts');
    return response.data.data;
  },

  async getResolvedByPeriod(period: 'week' | 'month' | 'year'): Promise<number> {
    const response = await api.get<{ data: { period: string; count: number } }>(
      `/tickets/stats/resolved?period=${period}`,
    );
    return response.data.data.count;
  },

  async getResolvedCounts(): Promise<{ week: number; month: number; year: number }> {
    const response = await api.get<{ data: { week: number; month: number; year: number } }>(
      '/tickets/stats/resolved-all',
    );
    return response.data.data;
  },
};
