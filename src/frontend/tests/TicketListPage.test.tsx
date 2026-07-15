import './shared-mocks';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TicketListPage } from '@/pages/TicketListPage';
import { ToastProvider } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';
import { userService } from '@/services/user.service';

import { mockCanWrite, mockNavigate } from './shared-mocks';
import { sampleTicket, sampleUser } from './fixtures';

vi.mock('@/services/ticket.service', () => ({
  ticketService: {
    getAll: vi.fn(),
  },
}));

vi.mock('@/services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
  },
}));

function renderTicketListPage() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <TicketListPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('TicketListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanWrite.value = true;

    vi.mocked(userService.getAll).mockResolvedValue([sampleUser]);
    vi.mocked(ticketService.getAll).mockResolvedValue({
      data: [sampleTicket],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders tickets and total count', async () => {
    renderTicketListPage();

    expect(await screen.findByRole('heading', { name: 'Tickets' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('1 tickets total')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Login page broken' })).toBeInTheDocument();
    });

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Open');
    expect(table).toHaveTextContent('High');

    expect(ticketService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 10,
      }),
    );
  });

  it('shows empty state when no tickets match filters', async () => {
    vi.mocked(ticketService.getAll).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    renderTicketListPage();

    expect(await screen.findByText('No tickets found.')).toBeInTheDocument();
  });

  it('navigates to create ticket when New Ticket is clicked', async () => {
    const user = userEvent.setup();
    renderTicketListPage();

    await screen.findByRole('link', { name: 'Login page broken' });
    await user.click(screen.getByRole('button', { name: '+ New Ticket' }));

    expect(mockNavigate).toHaveBeenCalledWith('/tickets/new');
  });

  it('hides New Ticket button for read-only roles', async () => {
    mockCanWrite.value = false;
    renderTicketListPage();

    await screen.findByRole('link', { name: 'Login page broken' });
    expect(screen.queryByRole('button', { name: '+ New Ticket' })).not.toBeInTheDocument();
  });

  it('filters tickets by status', async () => {
    renderTicketListPage();

    await screen.findByRole('link', { name: 'Login page broken' });
    vi.mocked(ticketService.getAll).mockClear();

    fireEvent.change(screen.getByLabelText('Filter by status'), {
      target: { value: 'open' },
    });

    await waitFor(() => {
      expect(ticketService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'open' }),
      );
    });
  });
});
