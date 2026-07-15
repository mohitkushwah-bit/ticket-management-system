import './shared-mocks';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersPage } from '@/pages/UsersPage';
import { ToastProvider } from '@/context/ToastContext';
import { roleService } from '@/services/role.service';
import { userService } from '@/services/user.service';

import { agentRoleId, sampleRoles, sampleUser } from './fixtures';
import { mockShowToast } from './shared-mocks';

vi.mock('@/services/user.service', () => ({
  userService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/services/role.service', () => ({
  roleService: {
    getAll: vi.fn(),
  },
}));

function renderUsersPage() {
  return render(
    <ToastProvider>
      <UsersPage />
    </ToastProvider>,
  );
}

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(userService.getAll).mockResolvedValue([sampleUser]);
    vi.mocked(roleService.getAll).mockResolvedValue(sampleRoles);
  });

  it('renders users in the table', async () => {
    renderUsersPage();

    expect(await screen.findByRole('heading', { name: 'User Management' })).toBeInTheDocument();
    expect(screen.getByText('Bob Agent')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('agent')).toBeInTheDocument();
  });

  it('creates a new user from the form', async () => {
    const user = userEvent.setup();
    const createdUser = {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      name: 'Jane User',
      email: 'jane@example.com',
      roleId: agentRoleId,
      role: 'agent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let resolveCreate!: (value: typeof createdUser) => void;
    vi.mocked(userService.create).mockImplementation(
      () => new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );

    renderUsersPage();
    await screen.findByText('Bob Agent');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: '+ New User' }));
    });
    expect(screen.getByRole('heading', { name: 'Create User' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'Jane User' } });
    fireEvent.change(screen.getByLabelText('User email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('User password'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('User role'), { target: { value: agentRoleId } });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Create User' }));
      resolveCreate(createdUser);
      await Promise.resolve();
    });

    expect(screen.getByText('Jane User')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Create User' })).not.toBeInTheDocument();
    expect(userService.create).toHaveBeenCalledWith({
      name: 'Jane User',
      email: 'jane@example.com',
      roleId: agentRoleId,
      password: 'secret123',
    });
    expect(mockShowToast).toHaveBeenCalledWith('success', 'User created.');
  });

  it('updates an existing user', async () => {
    const user = userEvent.setup();
    const updatedUser = {
      ...sampleUser,
      name: 'Bob Updated',
      email: 'bob.updated@example.com',
    };

    let resolveUpdate!: (value: typeof updatedUser) => void;
    vi.mocked(userService.update).mockImplementation(
      () => new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    renderUsersPage();
    await screen.findByText('Bob Agent');

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await act(async () => {
      await user.click(editButtons[0]);
    });

    expect(screen.getByRole('heading', { name: 'Edit User' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'Bob Updated' } });
    fireEvent.change(screen.getByLabelText('User email'), {
      target: { value: 'bob.updated@example.com' },
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Save Changes' }));
      resolveUpdate(updatedUser);
      await Promise.resolve();
    });

    expect(screen.getByText('Bob Updated')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Edit User' })).not.toBeInTheDocument();
    expect(userService.update).toHaveBeenCalledWith(sampleUser.id, {
      name: 'Bob Updated',
      email: 'bob.updated@example.com',
      roleId: sampleUser.roleId,
      password: undefined,
    });
    expect(mockShowToast).toHaveBeenCalledWith('success', 'User updated.');
  });

  it('deletes a user after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(userService.delete).mockResolvedValue(undefined);

    renderUsersPage();
    await screen.findByText('Bob Agent');

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await act(async () => {
      await user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(userService.delete).toHaveBeenCalledWith(sampleUser.id);
      expect(mockShowToast).toHaveBeenCalledWith('success', 'User deleted.');
      expect(screen.queryByText('Bob Agent')).not.toBeInTheDocument();
    });
  });
});
