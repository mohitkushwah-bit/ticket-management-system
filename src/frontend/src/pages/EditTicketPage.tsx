import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Ticket, User } from '../types';
import { ticketService } from '../services/ticket.service';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { Card, LoadingSpinner } from '../components/common';
import { TicketForm } from '../components/TicketForm';

import './EditTicketPage.css';

export const EditTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        showToast('error', 'Ticket ID is required.');
        setLoading(false);
        return;
      }

      try {
        const [ticketData, usersData] = await Promise.all([
          ticketService.getById(id),
          userService.getAll(),
        ]);
        setTicket(ticketData);
        setUsers(usersData);
      } catch (err) {
        showToast('error', getApiErrorMessage(err, 'Failed to load ticket details.'));
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id, showToast]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    prLink: string;
  }) => {
    if (!id) return;

    setSubmitting(true);

    try {
      await ticketService.update(id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedTo: data.assignedTo || null,
        prLink: data.prLink || null,
      });
      showToast('success', 'Ticket updated successfully.');
      navigate(`/tickets/${id}`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update ticket.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket for editing..." />;
  }

  if (!ticket) {
    return (
      <div className="edit-ticket-page__container">
        <h1 className="edit-ticket-page__title">Edit Ticket</h1>
        <p>Could not load ticket.</p>
      </div>
    );
  }

  return (
    <div className="edit-ticket-page__container">
      <div className="edit-ticket-page__header">
        <h1 className="edit-ticket-page__title">Edit Ticket</h1>
        <p className="edit-ticket-page__subtitle">Update title, description, priority, assignee, and PR link.</p>
      </div>

      <Card padding="lg">
        <TicketForm
          initialValues={{
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            assignedTo: ticket.assignedTo || '',
            prLink: ticket.prLink || '',
          }}
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={submitting}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
};
