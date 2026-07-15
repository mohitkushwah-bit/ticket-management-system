import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import { Ticket } from '../types';
import { TicketCard } from './TicketCard';

import './KanbanColumn.css';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
  validDropTarget: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  id,
  title,
  count,
  tickets,
  onTicketClick,
  validDropTarget,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${validDropTarget ? 'kanban-column--valid-target' : ''} ${isOver && validDropTarget ? 'kanban-column--over' : ''}`}
    >
      <div className="kanban-column__header">
        <h3 className="kanban-column__title">{title}</h3>
        <span className="kanban-column__count">{count}</span>
      </div>
      <div className="kanban-column__cards">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => onTicketClick(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
});
