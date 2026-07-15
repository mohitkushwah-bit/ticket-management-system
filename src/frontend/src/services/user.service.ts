import api from './api';
import { User } from '../types';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  roleId?: string;
  password?: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<{ data: User }>('/users', payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.patch<{ data: User }>(`/users/${id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
