import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '../services/error-utils';
import { Button, Input, Card } from '../components/common';

import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await authService.updateProfile({
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
      });
      updateUser(updated);
      showToast('success', 'Profile updated successfully.');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      showToast('error', 'Both current and new password are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      showToast('error', 'New password must be at least 8 characters.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      showToast('error', 'New password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      showToast('error', 'New password must contain at least one digit.');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'Password changed successfully.');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to change password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">Update Profile</h1>

      <Card padding="lg">
        <h2 className="profile-page__section-title">Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="profile-page__form">
          <div className="profile-page__field">
            <label htmlFor="profile-name" className="profile-page__label">Name</label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Full name"
            />
          </div>
          <div className="profile-page__field">
            <label htmlFor="profile-email" className="profile-page__label">Email</label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>
          <div className="profile-page__field">
            <label className="profile-page__label">Role</label>
            <Input value={user?.role || ''} disabled aria-label="Role" />
          </div>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card padding="lg">
        <h2 className="profile-page__section-title">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="profile-page__form">
          <div className="profile-page__field">
            <label htmlFor="current-password" className="profile-page__label">Current Password</label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              aria-label="Current password"
            />
          </div>
          <div className="profile-page__field">
            <label htmlFor="new-password" className="profile-page__label">New Password</label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="New password"
            />
          </div>
          <div className="profile-page__field">
            <label htmlFor="confirm-password" className="profile-page__label">Confirm New Password</label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="Confirm new password"
            />
          </div>
          <Button type="submit" loading={loading}>
            Change Password
          </Button>
        </form>
      </Card>
    </div>
  );
};
