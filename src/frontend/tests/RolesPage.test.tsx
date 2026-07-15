import './shared-mocks';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RolesPage } from '@/pages/RolesPage';
import { ToastProvider } from '@/context/ToastContext';
import { roleService } from '@/services/role.service';

import { defaultPermissions, sampleRoles } from './fixtures';
import { mockShowToast } from './shared-mocks';

vi.mock('@/services/role.service', () => ({
  roleService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

function renderRolesPage() {
  return render(
    <ToastProvider>
      <RolesPage />
    </ToastProvider>,
  );
}

describe('RolesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(roleService.getAll).mockResolvedValue(sampleRoles);
  });

  it('renders roles with permission tags', async () => {
    renderRolesPage();

    expect(await screen.findByRole('heading', { name: 'Roles' })).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('AGENT')).toBeInTheDocument();
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
    expect(screen.getAllByText(/Tickets:/).length).toBeGreaterThan(0);
  });

  it('creates a new role from the modal', async () => {
    const user = userEvent.setup();
    const createdRole = {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      name: 'manager',
      description: 'Team manager',
      permissions: defaultPermissions,
      createdAt: new Date().toISOString(),
    };

    let resolveCreate!: (value: typeof createdRole) => void;
    vi.mocked(roleService.create).mockImplementation(
      () => new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );

    renderRolesPage();
    await screen.findByText('ADMIN');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: '+ Add Role' }));
    });
    expect(await screen.findByRole('heading', { name: 'Create Role' })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('e.g. manager'), { target: { value: 'manager' } });
    fireEvent.change(screen.getByPlaceholderText('Brief description of this role'), {
      target: { value: 'Team manager' },
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Create Role' }));
      resolveCreate(createdRole);
      await Promise.resolve();
    });

    expect(screen.getByText('MANAGER')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Create Role' })).not.toBeInTheDocument();
    expect(roleService.create).toHaveBeenCalledWith({
      name: 'manager',
      description: 'Team manager',
      permissions: expect.objectContaining({
        tickets: expect.objectContaining({ read: true }),
      }),
    });
    expect(mockShowToast).toHaveBeenCalledWith('success', 'Role created successfully.');
  });

  it('blocks deletion of built-in roles', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');

    renderRolesPage();
    await screen.findByText('ADMIN');

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(mockShowToast).toHaveBeenCalledWith('error', 'Cannot delete built-in roles.');
    expect(roleService.delete).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('deletes a custom role after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(roleService.delete).mockResolvedValue(undefined);

    renderRolesPage();
    await screen.findByText('CUSTOM');

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await act(async () => {
      await user.click(deleteButtons[2]);
    });

    await waitFor(() => {
      expect(roleService.delete).toHaveBeenCalledWith('cccccccc-cccc-cccc-cccc-cccccccccccc');
      expect(mockShowToast).toHaveBeenCalledWith('success', 'Role deleted successfully.');
      expect(screen.queryByText('CUSTOM')).not.toBeInTheDocument();
    });
  });
});
