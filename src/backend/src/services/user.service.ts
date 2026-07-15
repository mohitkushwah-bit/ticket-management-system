import bcrypt from 'bcryptjs';

import { AppError } from '../middleware/error-handler';
import { User, CreateUserDto, AdminUpdateUserDto } from '../models/types';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError(400, 'Email is already in use', [{ message: 'Email is already in use', field: 'email' }]);
    }

    if (!dto.password || dto.password.length < 8) {
      throw new AppError(400, 'Password must be at least 8 characters', [{ message: 'Password must be at least 8 characters', field: 'password' }]);
    }
    if (!/[A-Z]/.test(dto.password)) {
      throw new AppError(400, 'Password must contain at least one uppercase letter', [{ message: 'Password must contain at least one uppercase letter', field: 'password' }]);
    }
    if (!/[0-9]/.test(dto.password)) {
      throw new AppError(400, 'Password must contain at least one digit', [{ message: 'Password must contain at least one digit', field: 'password' }]);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.userRepository.create(dto.name, dto.email, passwordHash, dto.roleId);
  }

  async updateUser(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new AppError(400, 'Email is already in use', [{ message: 'Email is already in use', field: 'email' }]);
      }
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      if (dto.password.length < 8) {
        throw new AppError(400, 'Password must be at least 8 characters', [{ message: 'Password must be at least 8 characters', field: 'password' }]);
      }
      if (!/[A-Z]/.test(dto.password)) {
        throw new AppError(400, 'Password must contain at least one uppercase letter', [{ message: 'Password must contain at least one uppercase letter', field: 'password' }]);
      }
      if (!/[0-9]/.test(dto.password)) {
        throw new AppError(400, 'Password must contain at least one digit', [{ message: 'Password must contain at least one digit', field: 'password' }]);
      }
      passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const updated = await this.userRepository.update(id, {
      name: dto.name,
      email: dto.email,
      roleId: dto.roleId,
      passwordHash,
    });

    if (!updated) {
      throw new AppError(404, 'User not found');
    }

    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const ticketCount = await this.userRepository.countTicketsByUser(id);
    if (ticketCount > 0) {
      throw new AppError(400, `Cannot delete user — they have ${ticketCount} ticket(s). Reassign or delete the tickets first.`);
    }

    await this.userRepository.delete(id);
  }
}
