import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { KanbanBoard } from '@/components/KanbanBoard';
import { STATUS_LABELS, Ticket, TicketStatus } from '@/types';

import { sampleTicket } from './fixtures';

type DragEndHandler = (event: { active: { id: string }; over: { id: string } | null }) => void;
type DragStartHandler = (event: { active: { id: string } }) => void;

let onDragStartHandler: DragStartHandler | null = null;
let onDragEndHandler: DragEndHandler | null = null;

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({
    children,
    onDragStart,
    onDragEnd,
  }: React.PropsWithChildren<{
    onDragStart?: DragStartHandler;
    onDragEnd?: DragEndHandler;
  }>) => {
    onDragStartHandler = onDragStart ?? null;
    onDragEndHandler = onDragEnd ?? null;
    return <div data-testid="dnd-context">{children}</div>;
  },
  DragOverlay: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
  closestCenter: vi.fn(),
  PointerSensor: class PointerSensor {},
  useSensor: vi.fn((sensor: unknown) => sensor),
  useSensors: vi.fn((...sensors: unknown[]) => sensors),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

const inProgressTicket: Ticket = {
  ...sampleTicket,
  id: '22222222-2222-2222-2222-222222222222',
  title: 'Email notifications missing',
  status: 'in_progress',
  priority: 'medium',
};

const COLUMN_STATUSES: TicketStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
];

function getColumnCount(status: TicketStatus): HTMLElement {
  const header = screen.getByRole('heading', { name: STATUS_LABELS[status] }).parentElement;
  const count = header?.querySelector('.kanban-column__count');
  if (!count) {
    throw new Error(`Count element not found for ${status} column`);
  }
  return count as HTMLElement;
}

function renderKanbanBoard(
  tickets: Ticket[] = [sampleTicket, inProgressTicket],
  overrides?: Partial<{
    onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<boolean>;
    onTicketClick: (ticketId: string) => void;
  }>,
) {
  const onStatusChange = overrides?.onStatusChange ?? vi.fn().mockResolvedValue(true);
  const onTicketClick = overrides?.onTicketClick ?? vi.fn();

  const view = render(
    <KanbanBoard
      tickets={tickets}
      onStatusChange={onStatusChange}
      onTicketClick={onTicketClick}
    />,
  );

  return { onStatusChange, onTicketClick, ...view };
}

async function simulateDragEnd(ticketId: string, targetStatus: TicketStatus) {
  await act(async () => {
    onDragStartHandler?.({ active: { id: ticketId } });
    await onDragEndHandler?.({ active: { id: ticketId }, over: { id: targetStatus } });
  });
}

describe('KanbanBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onDragStartHandler = null;
    onDragEndHandler = null;
  });

  it('renders all status columns with labels and ticket counts', () => {
    renderKanbanBoard();

    COLUMN_STATUSES.forEach((status) => {
      expect(screen.getByRole('heading', { name: STATUS_LABELS[status] })).toBeInTheDocument();
    });

    expect(getColumnCount('open')).toHaveTextContent('1');
    expect(getColumnCount('in_progress')).toHaveTextContent('1');
    expect(getColumnCount('resolved')).toHaveTextContent('0');
    expect(getColumnCount('closed')).toHaveTextContent('0');
    expect(getColumnCount('cancelled')).toHaveTextContent('0');
  });

  it('groups tickets into matching status columns', () => {
    renderKanbanBoard();

    expect(screen.getByLabelText('Ticket: Login page broken')).toBeInTheDocument();
    expect(screen.getByLabelText('Ticket: Email notifications missing')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('calls onTicketClick when a ticket card is clicked', async () => {
    const user = userEvent.setup();
    const onTicketClick = vi.fn();
    renderKanbanBoard([sampleTicket], { onTicketClick });

    await user.click(screen.getByLabelText('Ticket: Login page broken'));

    expect(onTicketClick).toHaveBeenCalledWith(sampleTicket.id);
  });

  it('calls onStatusChange for a valid status transition on drag end', async () => {
    const onStatusChange = vi.fn().mockResolvedValue(true);
    renderKanbanBoard([sampleTicket], { onStatusChange });

    await simulateDragEnd(sampleTicket.id, 'in_progress');

    expect(onStatusChange).toHaveBeenCalledWith(sampleTicket.id, 'in_progress');
  });

  it('does not call onStatusChange for invalid status transitions', async () => {
    const onStatusChange = vi.fn().mockResolvedValue(true);
    renderKanbanBoard([sampleTicket], { onStatusChange });

    await simulateDragEnd(sampleTicket.id, 'closed');

    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it('does not call onStatusChange when dropped on the same column', async () => {
    const onStatusChange = vi.fn().mockResolvedValue(true);
    renderKanbanBoard([sampleTicket], { onStatusChange });

    await simulateDragEnd(sampleTicket.id, 'open');

    expect(onStatusChange).not.toHaveBeenCalled();
  });
});
