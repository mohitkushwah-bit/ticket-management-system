import React, { useEffect, useState } from 'react';

import { Role, RolePermissions, ScreenName } from '../types';
import { getApiErrorMessage } from '../services/error-utils';
import { roleService } from '../services/role.service';
import { useToast } from '../context/ToastContext';
import { Button, Card, LoadingSpinner } from '../components/common';
import { RoleFormModal } from '../components/RoleFormModal';

import './RolesPage.css';

const SCREEN_LABELS: Record<ScreenName, string> = {
  dashboard: 'Dashboard',
  tickets: 'Tickets',
  kanban: 'Kanban',
  users: 'Users',
  roles: 'Roles',
};

export const RolesPage: React.FC = () => {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    try {
      setRoles(await roleService.getAll());
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to load roles.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleDelete = async (role: Role) => {
    const builtIn = ['admin', 'agent', 'user'];
    if (builtIn.includes(role.name)) {
      showToast('error', 'Cannot delete built-in roles.');
      return;
    }
    if (!window.confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;

    try {
      await roleService.delete(role.id);
      showToast('success', 'Role deleted successfully.');
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to delete role.'));
    }
  };

  const handleSave = async (data: { name: string; description: string; permissions: RolePermissions }) => {
    setSaving(true);
    try {
      if (editingRole) {
        const updated = await roleService.update(editingRole.id, data);
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? updated : r)));
        showToast('success', 'Role updated successfully.');
      } else {
        const created = await roleService.create(data);
        setRoles((prev) => [...prev, created]);
        showToast('success', 'Role created successfully.');
      }
      setShowForm(false);
      setEditingRole(null);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to save role.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading roles..." />;

  return (
    <div className="roles-page">
      <div className="roles-page__header">
        <h1>Roles</h1>
        <Button onClick={handleCreate}>+ Add Role</Button>
      </div>

      <Card padding="lg">
        <table className="roles-page__table" role="table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <span className={`roles-page__badge roles-page__badge--${role.name}`}>
                    {role.name.toUpperCase()}
                  </span>
                </td>
                <td>{role.description || '—'}</td>
                <td className="roles-page__permissions">
                  {role.permissions ? (
                    <div className="roles-page__perm-grid">
                      {(Object.keys(SCREEN_LABELS) as ScreenName[]).map((screen) => {
                        const access = role.permissions[screen];
                        if (!access?.read && !access?.write) return null;
                        return (
                          <span key={screen} className="roles-page__perm-tag">
                            {SCREEN_LABELS[screen]}:
                            {access.read && ' R'}
                            {access.write && ' W'}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                    <div className="roles-page__actions">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                            Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(role)}>
                            Delete
                        </Button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showForm && (
        <RoleFormModal
          key={editingRole?.id ?? 'new'}
          role={editingRole}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingRole(null); }}
          loading={saving}
        />
      )}
    </div>
  );
};
