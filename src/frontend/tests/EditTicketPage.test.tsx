import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { EditTicketPage } from '@/pages/EditTicketPage';
import { ToastProvider } from '@/context/ToastContext';
import { ticketService } from '@/services/ticket.service';
import { userService } from '@/services/user.service';

const mockNavigate = vi.fn();
const mockShowToast = vi.fn();

vi.mock('@/services/ticket.service', () => ({
  ticketService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
  },
}));

vi.mock('@/context/ToastContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ToastContext')>('@/context/ToastContext');
  return {
    ...actual,
    useToast: () => ({ showToast: mockShowToast }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const ticketId = '11111111-1111-1111-1111-111111111111';

function renderEditTicketPage() {
  return render(
    <MemoryRouter
      initialEntries={[`/tickets/${ticketId}/edit`]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ToastProvider>
        <Routes>
          <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('EditTicketPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ticketService.getById).mockResolvedValue({
      id: ticketId,
      title: 'Old title',
      description: 'Old description',
      priority: 'medium',
      status: 'open',
      assignedTo: null,
      prLink: null,
      createdBy: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    vi.mocked(userService.getAll).mockResolvedValue([
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'Bob Agent',
        email: 'bob@example.com',
        roleId: 'role-agent-id',
        role: 'agent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    vi.mocked(ticketService.update).mockResolvedValue({
      id: ticketId,
      title: 'Updated title',
      description: 'Updated description',
      priority: 'high',
      status: 'open',
      assignedTo: null,
      prLink: null,
      createdBy: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  it('prefills form fields and submits update', async () => {
    const user = userEvent.setup();
    renderEditTicketPage();

    const titleInput = await screen.findByLabelText('Title*');
    await waitFor(() => {
      expect(titleInput).toHaveValue('Old title');
    });

    fireEvent.change(titleInput, { target: { value: 'Updated title' } });
    fireEvent.change(screen.getByLabelText('Description*'), {
      target: { value: 'Updated description' },
    });
    fireEvent.change(screen.getByLabelText('Priority*'), { target: { value: 'high' } });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    });

    await waitFor(() => {
      expect(ticketService.update).toHaveBeenCalledWith(
        ticketId,
        expect.objectContaining({
          title: 'Updated title',
          description: 'Updated description',
          priority: 'high',
          assignedTo: null,
          prLink: null,
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(`/tickets/${ticketId}`);
      expect(mockShowToast).toHaveBeenCalledWith('success', 'Ticket updated successfully.');
      expect(screen.getByRole('button', { name: 'Save Changes' })).not.toBeDisabled();
    });
  });
});
