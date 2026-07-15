import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '../types';
import { ticketService } from '../services/ticket.service';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Card, LoadingSpinner } from '../components/common';
import { TicketForm } from '../components/TicketForm';

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    userService.getAll().then(setUsers).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    prLink: string;
  }) => {
    setSubmitting(true);
    try {
      const ticket = await ticketService.create({
        ...data,
        assignedTo: data.assignedTo || null,
        prLink: data.prLink || null,
        createdBy: user!.id,
      });
      showToast('success', 'Ticket created successfully.');
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to create ticket.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Create New Ticket</h1>
      <Card padding="lg">
        <TicketForm
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={submitting}
        />
      </Card>
    </div>
  );
};
