import './shared-mocks';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateTicketPage } from '@/pages/CreateTicketPage';
import { ToastProvider } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';
import { userService } from '@/services/user.service';

import { authUserId, sampleTicket, sampleUser } from './fixtures';
import { mockNavigate, mockShowToast } from './shared-mocks';

vi.mock('@/services/ticket.service', () => ({
  ticketService: {
    create: vi.fn(),
  },
}));

vi.mock('@/services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
  },
}));

function renderCreateTicketPage() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <CreateTicketPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('CreateTicketPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(userService.getAll).mockResolvedValue([sampleUser]);
    vi.mocked(ticketService.create).mockResolvedValue({
      ...sampleTicket,
      id: '22222222-2222-2222-2222-222222222222',
      title: 'New support request',
      description: 'Customer needs help with billing.',
      priority: 'medium',
      assignedTo: null,
    });
  });

  it('submits a new ticket and navigates to detail page', async () => {
    const user = userEvent.setup();
    renderCreateTicketPage();

    expect(await screen.findByRole('heading', { name: 'Create New Ticket' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Title*'), {
      target: { value: 'New support request' },
    });
    fireEvent.change(screen.getByLabelText('Description*'), {
      target: { value: 'Customer needs help with billing.' },
    });
    fireEvent.change(screen.getByLabelText('Priority*'), { target: { value: 'medium' } });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Create Ticket' }));
    });

    await waitFor(() => {
      expect(ticketService.create).toHaveBeenCalledWith({
        title: 'New support request',
        description: 'Customer needs help with billing.',
        priority: 'medium',
        assignedTo: null,
        prLink: null,
        createdBy: authUserId,
      });
      expect(mockShowToast).toHaveBeenCalledWith('success', 'Ticket created successfully.');
      expect(mockNavigate).toHaveBeenCalledWith('/tickets/22222222-2222-2222-2222-222222222222');
      expect(screen.getByRole('button', { name: 'Create Ticket' })).not.toBeDisabled();
    });
  });
});
