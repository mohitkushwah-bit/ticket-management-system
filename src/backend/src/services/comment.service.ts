import { AppError } from '../middleware/error-handler';
import { Comment, CreateCommentDto } from '../models/types';
import { CommentRepository } from '../repositories/comment.repository';
import { TicketRepository } from '../repositories/ticket.repository';

export class CommentService {
  private commentRepository: CommentRepository;
  private ticketRepository: TicketRepository;

  constructor(commentRepository?: CommentRepository, ticketRepository?: TicketRepository) {
    this.commentRepository = commentRepository || new CommentRepository();
    this.ticketRepository = ticketRepository || new TicketRepository();
  }

  async getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError(404, 'Ticket not found');
    }
    return this.commentRepository.findByTicketId(ticketId);
  }

  async addComment(ticketId: string, dto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.commentRepository.create(ticketId, dto);
    } catch (error: unknown) {
      // FK constraint violation means ticket doesn't exist
      if (error instanceof Error && 'code' in error && (error as { code: string }).code === '23503') {
        throw new AppError(404, 'Ticket not found');
      }
      throw error;
    }
  }
}
