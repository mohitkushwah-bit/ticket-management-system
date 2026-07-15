import api from './api';
import { Comment } from '../types';

interface CreateCommentPayload {
  message: string;
  createdBy: string;
}

export const commentService = {
  async getByTicketId(ticketId: string): Promise<Comment[]> {
    const response = await api.get<{ data: Comment[] }>(`/tickets/${ticketId}/comments`);
    return response.data.data;
  },

  async create(ticketId: string, payload: CreateCommentPayload): Promise<Comment> {
    const response = await api.post<{ data: Comment }>(`/tickets/${ticketId}/comments`, payload);
    return response.data.data;
  },
};
