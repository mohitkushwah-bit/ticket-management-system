import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Ticket, TicketStatus } from '../types';
import { ticketService } from '../services/ticket.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common';
import { KanbanBoard } from '../components/KanbanBoard';

import './KanbanPage.css';

export const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    try {
      const result = await ticketService.getAll({ limit: 100 });
      setTickets(result.data);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to load tickets.'));
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = useCallback(async (ticketId: string, newStatus: TicketStatus): Promise<boolean> => {
    try {
      const updated = await ticketService.changeStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updated : t)),
      );
      return true;
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Invalid status transition.'));
      return false;
    }
  }, [showToast]);

  const handleTicketClick = useCallback((ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  }, [navigate]);

  if (loading) return <LoadingSpinner message="Loading board..." />;

  return (
    <div>
      <h1 className="kanban-page__heading">Kanban Board</h1>
      <KanbanBoard
        tickets={tickets}
        onStatusChange={handleStatusChange}
        onTicketClick={handleTicketClick}
      />
    </div>
  );
};
