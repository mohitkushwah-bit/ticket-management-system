import api from './api';
import { Role, RolePermissions } from '../types';

interface RoleResponse {
  data: Role;
}

interface RolesResponse {
  data: Role[];
}

export const roleService = {
  async getAll(): Promise<Role[]> {
    const response = await api.get<RolesResponse>('/roles');
    return response.data.data;
  },

  async getById(id: string): Promise<Role> {
    const response = await api.get<RoleResponse>(`/roles/${id}`);
    return response.data.data;
  },

  async create(data: { name: string; description: string; permissions: RolePermissions }): Promise<Role> {
    const response = await api.post<RoleResponse>('/roles', data);
    return response.data.data;
  },

  async update(id: string, data: { name?: string; description?: string; permissions?: RolePermissions }): Promise<Role> {
    const response = await api.patch<RoleResponse>(`/roles/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  },
};
