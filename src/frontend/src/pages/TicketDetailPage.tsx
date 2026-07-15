import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Ticket, Comment as TicketComment, User, VALID_TRANSITIONS, STATUS_LABELS } from '../types';
import { ticketService } from '../services/ticket.service';
import { commentService } from '../services/comment.service';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import { Button, LoadingSpinner, Card } from '../components/common';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CommentList } from '../components/CommentList';

import './TicketDetailPage.css';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { canWrite } = useRole();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [ticketData, commentsData, usersData] = await Promise.all([
          ticketService.getById(id),
          commentService.getByTicketId(id),
          userService.getAll(),
        ]);
        setTicket(ticketData);
        setComments(commentsData);
        setUsers(usersData);
      } catch (err) {
        showToast('error', getApiErrorMessage(err, 'Failed to load ticket.'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showToast]);

  const handleStatusChange = useCallback(async (newStatus: string) => {
    if (!id) return;
    setStatusLoading(true);
    try {
      const updated = await ticketService.changeStatus(id, newStatus as Ticket['status']);
      setTicket(updated);
      showToast('success', `Status changed to ${STATUS_LABELS[newStatus as Ticket['status']]}.`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to change status.'));
    } finally {
      setStatusLoading(false);
    }
  }, [id, showToast]);

  const handleAddComment = useCallback(async (message: string) => {
    if (!id || !user) return;
    try {
      const comment = await commentService.create(id, {
        message,
        createdBy: user.id,
      });
      setComments((prev) => [...prev, comment]);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to add comment.'));
    }
  }, [id, user, showToast]);

  const assigneeName = useMemo(() => {
    if (!ticket?.assignedTo) return 'Unassigned';
    return users.find((u) => u.id === ticket.assignedTo)?.name || 'Unknown';
  }, [ticket?.assignedTo, users]);

  const creatorName = useMemo(() => {
    if (!ticket?.createdBy) return 'Unknown';
    return users.find((u) => u.id === ticket.createdBy)?.name || 'Unknown';
  }, [ticket?.createdBy, users]);

  if (loading) return <LoadingSpinner message="Loading ticket..." />;
  if (!ticket) return <p>Ticket not found</p>;

  const validTransitions = VALID_TRANSITIONS[ticket.status];

  return (
    <div className="ticket-detail">
      <div className="ticket-detail__header">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          &larr; Back
        </Button>
        {canWrite && (
          <Button variant="secondary" onClick={() => navigate(`/tickets/${id}/edit`)}>
            Edit
          </Button>
        )}
      </div>

      <Card padding="lg">
        <div className="ticket-detail__top">
          <h1 className="ticket-detail__title">{ticket.title}</h1>
          <div className="ticket-detail__badges">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <p className="ticket-detail__description">{ticket.description}</p>

        <div className="ticket-detail__meta">
          <div className="ticket-detail__meta-item">
            <span className="ticket-detail__meta-label">Assignee</span>
            <span>{assigneeName}</span>
          </div>
          <div className="ticket-detail__meta-item">
            <span className="ticket-detail__meta-label">Created by</span>
            <span>{creatorName}</span>
          </div>
          <div className="ticket-detail__meta-item">
            <span className="ticket-detail__meta-label">Created</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString('en-AU')}</span>
          </div>
          {ticket.prLink && /^https?:\/\//i.test(ticket.prLink) && (
            <div className="ticket-detail__meta-item">
              <span className="ticket-detail__meta-label">PR Link</span>
              <a href={ticket.prLink} target="_blank" rel="noopener noreferrer">
                {ticket.prLink}
              </a>
            </div>
          )}
        </div>

        {canWrite && validTransitions.length > 0 && (
          <div className="ticket-detail__actions">
            <span className="ticket-detail__meta-label">Transition to:</span>
            <div className="ticket-detail__transition-buttons">
              {validTransitions.map((status) => (
                <Button
                  key={status}
                  variant="secondary"
                  size="sm"
                  loading={statusLoading}
                  onClick={() => handleStatusChange(status)}
                >
                  {STATUS_LABELS[status]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card padding="lg">
        <CommentList
          comments={comments}
          users={users}
          onAddComment={canWrite ? handleAddComment : undefined}
        />
      </Card>
    </div>
  );
};
