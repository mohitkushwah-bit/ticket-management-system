import { AppError } from '../middleware/error-handler';
import { isValidTransition, getValidTransitions } from '../models/state-machine';
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
  TicketFilters,
  PaginatedResponse,
} from '../models/types';
import { TicketRepository } from '../repositories/ticket.repository';

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor(ticketRepository?: TicketRepository) {
    this.ticketRepository = ticketRepository || new TicketRepository();
  }

  async getAllTickets(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
    return this.ticketRepository.findAll(filters);
  }

  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new AppError(404, 'Ticket not found');
    }
    return ticket;
  }

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    return this.ticketRepository.create(dto);
  }

  async updateTicket(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const existing = await this.ticketRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Ticket not found');
    }
    const updated = await this.ticketRepository.update(id, dto);
    if (!updated) {
      throw new AppError(500, 'Failed to update ticket');
    }
    return updated;
  }

  async changeStatus(id: string, newStatus: TicketStatus): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new AppError(404, 'Ticket not found');
    }

    if (!isValidTransition(ticket.status, newStatus)) {
      const validNext = getValidTransitions(ticket.status);
      const validStr = validNext.length > 0 ? validNext.join(', ') : 'none (terminal state)';
      throw new AppError(422, `Invalid status transition from '${ticket.status}' to '${newStatus}'. Valid transitions: ${validStr}`);
    }

    const updated = await this.ticketRepository.updateStatusAtomic(id, ticket.status, newStatus);
    if (!updated) {
      throw new AppError(409, 'Ticket status was modified by another request. Please refresh and try again.');
    }
    return updated;
  }

  async getStatusCounts(): Promise<Record<TicketStatus, number>> {
    return this.ticketRepository.getStatusCounts();
  }

  async getResolvedCountByPeriod(period: 'week' | 'month' | 'year'): Promise<number> {
    return this.ticketRepository.getResolvedCountByPeriod(period);
  }

  async getResolvedCountsAll(): Promise<{ week: number; month: number; year: number }> {
    return this.ticketRepository.getResolvedCountsAll();
  }
}
