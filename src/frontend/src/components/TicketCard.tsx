import React from 'react';
import { useDraggable } from '@dnd-kit/core';

import { Ticket } from '../types';
import { PriorityBadge } from './StatusBadge';

import './TicketCard.css';

interface TicketCardProps {
  ticket: Ticket;
  isDragging?: boolean;
  onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, isDragging = false, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ticket.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`ticket-card ${isDragging ? 'ticket-card--dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ticket: ${ticket.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <p className="ticket-card__title">{ticket.title}</p>
      <div className="ticket-card__footer">
        <PriorityBadge priority={ticket.priority} size="sm" />
        <span className="ticket-card__id">
          {ticket.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
};
