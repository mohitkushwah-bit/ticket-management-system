import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../services/error-utils';
import { Button, Input } from '../components/common';

import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('error', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <h1 className="login-page__title">TMS</h1>
          <p className="login-page__subtitle">Sign in to Ticket Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <label htmlFor="email" className="login-page__label">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              autoComplete="email"
            />
          </div>

          <div className="login-page__field">
            <label htmlFor="password" className="login-page__label">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
        </form>

        <p className="login-page__hint">
          {import.meta.env.DEV && 'Demo: alice@example.com / password123'}
        </p>
      </div>
    </div>
  );
};
