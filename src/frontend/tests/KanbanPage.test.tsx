import './shared-mocks';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { KanbanPage } from '@/pages/KanbanPage';
import { ToastProvider } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';

import { sampleTicket } from './fixtures';
import { mockNavigate } from './shared-mocks';

const inProgressTicket = {
  ...sampleTicket,
  id: '22222222-2222-2222-2222-222222222222',
  title: 'Email notifications missing',
  status: 'in_progress' as const,
};

vi.mock('@/services/ticket.service', () => ({
  ticketService: {
    getAll: vi.fn(),
    changeStatus: vi.fn(),
  },
}));

function renderKanbanPage() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <KanbanPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('KanbanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ticketService.getAll).mockResolvedValue({
      data: [sampleTicket, inProgressTicket],
      total: 2,
      page: 1,
      limit: 100,
      totalPages: 1,
    });
  });

  it('loads tickets and renders the kanban board', async () => {
    renderKanbanPage();

    expect(await screen.findByRole('heading', { name: 'Kanban Board' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ticket: Login page broken')).toBeInTheDocument();
    expect(screen.getByLabelText('Ticket: Email notifications missing')).toBeInTheDocument();

    expect(ticketService.getAll).toHaveBeenCalledWith({ limit: 100 });
  });

  it('navigates to ticket detail when a card is clicked', async () => {
    const user = userEvent.setup();
    renderKanbanPage();

    await screen.findByLabelText('Ticket: Login page broken');
    await act(async () => {
      await user.click(screen.getByLabelText('Ticket: Login page broken'));
    });

    expect(mockNavigate).toHaveBeenCalledWith(`/tickets/${sampleTicket.id}`);
  });
});
