import React, { useState } from 'react';

import { Role, RolePermissions, ScreenName } from '../types';
import { Button, Input } from './common';

import './RoleFormModal.css';

const SCREENS: { key: ScreenName; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'kanban', label: 'Kanban' }
];

const DEFAULT_PERMISSIONS: RolePermissions = {
  dashboard: { read: true, write: false },
  tickets: { read: true, write: false },
  kanban: { read: true, write: false },
  users: { read: false, write: false },
  roles: { read: false, write: false },
};

interface RoleFormModalProps {
  role?: Role | null;
  onSave: (data: { name: string; description: string; permissions: RolePermissions }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({ role, onSave, onCancel, loading }) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [permissions, setPermissions] = useState<RolePermissions>(role?.permissions || DEFAULT_PERMISSIONS);

  const handlePermissionChange = (screen: ScreenName, access: 'read' | 'write', checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [screen]: {
        ...prev[screen],
        [access]: checked,
        // If write is checked, read must also be checked
        ...(access === 'write' && checked ? { read: true } : {}),
        // If read is unchecked, write must also be unchecked
        ...(access === 'read' && !checked ? { write: false } : {}),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), description: description.trim(), permissions });
  };

  return (
    <div
      className="role-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-modal-title"
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
    >
      <div className="role-modal">
        <h2 id="role-modal-title" className="role-modal__title">
          {role ? 'Edit Role' : 'Create Role'}
        </h2>

        <form onSubmit={handleSubmit} className="role-modal__form">
          <Input
            label="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. manager"
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this role"
          />

          <fieldset className="role-modal__permissions">
            <legend className="role-modal__legend">Screen Permissions</legend>
            <table className="role-modal__table" role="table">
              <thead>
                <tr>
                  <th>Screen</th>
                  <th>Read</th>
                  <th>Write</th>
                </tr>
              </thead>
              <tbody>
                {SCREENS.map(({ key, label }) => (
                  <tr key={key}>
                    <td className="role-modal__screen-label">{label}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permissions[key].read}
                        disabled={true}
                        onChange={(e) => handlePermissionChange(key, 'read', e.target.checked)}
                        aria-label={`${label} read access`}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permissions[key].write}
                        onChange={(e) => handlePermissionChange(key, 'write', e.target.checked)}
                        aria-label={`${label} write access`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          <div className="role-modal__actions">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {role ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
