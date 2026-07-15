import { AppError } from '../middleware/error-handler';
import { Role, CreateRoleDto, UpdateRoleDto } from '../models/types';
import { RoleRepository } from '../repositories/role.repository';

export class RoleService {
  private roleRepository: RoleRepository;

  constructor(roleRepository?: RoleRepository) {
    this.roleRepository = roleRepository || new RoleRepository();
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }
    return role;
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new AppError(400, 'Role name already exists', [{ message: 'Role name already exists', field: 'name' }]);
    }
    return this.roleRepository.create(dto.name, dto.description || null, dto.permissions);
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.roleRepository.findByName(dto.name);
      if (existing) {
        throw new AppError(400, 'Role name already exists', [{ message: 'Role name already exists', field: 'name' }]);
      }
    }

    const updated = await this.roleRepository.update(id, {
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions,
    });

    if (!updated) {
      throw new AppError(404, 'Role not found');
    }
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }

    // Prevent deleting built-in roles
    const builtIn = ['admin', 'agent', 'user'];
    if (builtIn.includes(role.name)) {
      throw new AppError(400, 'Cannot delete built-in role');
    }

    const userCount = await this.roleRepository.countUsersByRole(id);
    if (userCount > 0) {
      throw new AppError(400, `Cannot delete role "${role.name}" — it is assigned to ${userCount} user(s). Reassign them first.`);
    }

    await this.roleRepository.delete(id);
  }
}
