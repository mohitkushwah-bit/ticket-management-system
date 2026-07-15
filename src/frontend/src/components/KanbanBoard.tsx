import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { Ticket, TicketStatus, STATUS_LABELS, VALID_TRANSITIONS } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { TicketCard } from './TicketCard';

import './KanbanBoard.css';

const COLUMN_ORDER: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed', 'cancelled'];

interface KanbanBoardProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<boolean>;
  onTicketClick: (ticketId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tickets,
  onStatusChange,
  onTicketClick,
}) => {
  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const ticketsByStatus = React.useMemo(
    () =>
      COLUMN_ORDER.reduce(
        (acc, status) => {
          acc[status] = tickets.filter((t) => t.status === status);
          return acc;
        },
        {} as Record<TicketStatus, Ticket[]>,
      ),
    [tickets],
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id);
    if (ticket) setActiveTicket(ticket);
  }, [tickets]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    setActiveTicket(null);
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id as string;
    const targetStatus = over.id as TicketStatus;
    const ticket = tickets.find((t) => t.id === ticketId);

    if (!ticket || ticket.status === targetStatus) return;

    if (!VALID_TRANSITIONS[ticket.status].includes(targetStatus)) {
      return;
    }

    try {
      await onStatusChange(ticketId, targetStatus);
    } catch {
      // Error is handled by the parent's onStatusChange callback
    }
  }, [tickets, onStatusChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={STATUS_LABELS[status]}
            count={ticketsByStatus[status].length}
            tickets={ticketsByStatus[status]}
            onTicketClick={onTicketClick}
            validDropTarget={
              activeTicket ? VALID_TRANSITIONS[activeTicket.status].includes(status) : false
            }
          />
        ))}
      </div>
      <DragOverlay>
        {activeTicket && <TicketCard ticket={activeTicket} isDragging />}
      </DragOverlay>
    </DndContext>
  );
};
