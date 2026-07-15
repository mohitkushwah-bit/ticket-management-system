import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { EditTicketPage } from './EditTicketPage';
import { ToastProvider } from '../context/ToastContext';
import { ticketService } from '../services/ticket.service';
import { userService } from '../services/user.service';

const mockNavigate = vi.fn();

vi.mock('../services/ticket.service', () => ({
  ticketService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EditTicketPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ticketService.getById).mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
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
      id: '11111111-1111-1111-1111-111111111111',
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
    render(
      <MemoryRouter initialEntries={['/tickets/11111111-1111-1111-1111-111111111111/edit']}>
        <ToastProvider>
          <Routes>
            <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue('Old title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Old description')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText('Title*'));
    await user.type(screen.getByLabelText('Title*'), 'Updated title');
    await user.clear(screen.getByLabelText('Description*'));
    await user.type(screen.getByLabelText('Description*'), 'Updated description');
    await user.selectOptions(screen.getByLabelText('Priority*'), 'high');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(ticketService.update).toHaveBeenCalledWith(
        '11111111-1111-1111-1111-111111111111',
        expect.objectContaining({
          title: 'Updated title',
          description: 'Updated description',
          priority: 'high',
          assignedTo: null,
          prLink: null,
        }),
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/tickets/11111111-1111-1111-1111-111111111111');
  });
});
