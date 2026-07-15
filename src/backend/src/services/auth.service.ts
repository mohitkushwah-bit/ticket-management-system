import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';
import { AuthUser, JwtPayload, UpdateProfileDto, UserRole } from '../models/types';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user || !user.passwordHash) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as string & jwt.SignOptions['expiresIn'],
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role as UserRole },
    };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { id: user.id, name: user.name, email: user.email, role: user.role as UserRole };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<AuthUser> {
    if (dto.newPassword) {
      if (dto.newPassword.length < 8) {
        throw new AppError(400, 'Password must be at least 8 characters', [
          { message: 'Password must be at least 8 characters', field: 'newPassword' },
        ]);
      }
      if (!/[A-Z]/.test(dto.newPassword)) {
        throw new AppError(400, 'Password must contain at least one uppercase letter', [
          { message: 'Password must contain at least one uppercase letter', field: 'newPassword' },
        ]);
      }
      if (!/[0-9]/.test(dto.newPassword)) {
        throw new AppError(400, 'Password must contain at least one digit', [
          { message: 'Password must contain at least one digit', field: 'newPassword' },
        ]);
      }

      if (!dto.currentPassword) {
        throw new AppError(400, 'Current password is required to change password', [
          { message: 'Current password is required to change password', field: 'currentPassword' },
        ]);
      }

      const passwordHash = await this.userRepository.getPasswordHash(userId);
      if (!passwordHash) {
        throw new AppError(404, 'User not found');
      }

      const isValid = await bcrypt.compare(dto.currentPassword, passwordHash);
      if (!isValid) {
        throw new AppError(400, 'Current password is incorrect', [
          { message: 'Current password is incorrect', field: 'currentPassword' },
        ]);
      }
    }

    if (dto.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing.id !== userId) {
        throw new AppError(400, 'Email is already in use', [
          { message: 'Email is already in use', field: 'email' },
        ]);
      }
    }

    let hashedPassword: string | undefined;
    if (dto.newPassword) {
      hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    }

    const updated = await this.userRepository.update(userId, {
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
    });

    if (!updated) {
      throw new AppError(404, 'User not found');
    }

    return { id: updated.id, name: updated.name, email: updated.email, role: updated.role as UserRole };
  }
}
