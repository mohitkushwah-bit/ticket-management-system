import React, { useEffect, useState } from 'react';

import { User, Role } from '../types';
import { userService } from '../services/user.service';
import { roleService } from '../services/role.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { Button, Input, Select, Card, LoadingSpinner } from '../components/common';

import './UsersPage.css';

interface UserFormData {
  name: string;
  email: string;
  roleId: string;
  password: string;
}

export const UsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '', roleId: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          userService.getAll(),
          roleService.getAll(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        showToast('error', getApiErrorMessage(err, 'Failed to load data.'));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name.charAt(0).toUpperCase() + r.name.slice(1) }));

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', roleId: roles[0]?.id || '', password: '' });
    setSubmitting(false);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, roleId: user.roleId, password: '' });
    setSubmitting(false);
    setShowForm(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await userService.delete(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast('success', 'User deleted.');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to delete user.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        const updated = await userService.update(editingUser.id, {
          name: formData.name,
          email: formData.email,
          roleId: formData.roleId,
          password: formData.password || undefined,
        });
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast('success', 'User updated.');
      } else {
        const created = await userService.create(formData);
        setUsers((prev) => [...prev, created]);
        showToast('success', 'User created.');
      }
      setShowForm(false);
      setEditingUser(null);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to save user.'));
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>User Management</h1>
        <Button onClick={handleCreate}>+ New User</Button>
      </div>

      {showForm && (
        <Card padding="lg">
          <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
          <form onSubmit={handleSubmit} className="users-page__form">
            <div className="users-page__field">
              <label htmlFor="user-name">Name</label>
              <Input
                id="user-name"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                required
                aria-label="User name"
              />
            </div>
            <div className="users-page__field">
              <label htmlFor="user-email">Email</label>
              <Input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                required
                aria-label="User email"
              />
            </div>
            <div className="users-page__field">
              <label htmlFor="user-role">Role</label>
              <Select
                id="user-role"
                options={roleOptions}
                value={formData.roleId}
                onChange={(e) => setFormData((f) => ({ ...f, roleId: e.target.value }))}
                aria-label="User role"
              />
            </div>
            <div className="users-page__field">
              <label htmlFor="user-password">
                {editingUser ? 'New Password (leave blank to keep old password)' : 'Password'}
              </label>
              <Input
                id="user-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                required={!editingUser}
                aria-label="User password"
              />
            </div>
            <div className="users-page__form-actions">
              <Button type="submit" loading={submitting}>
                {editingUser ? 'Save Changes' : 'Create User'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="users-page__table-wrapper">
        <table className="users-page__table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`users-page__role users-page__role--${user.role}`}>{user.role}</span></td>
                <td>
                  <div className="users-page__actions">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
