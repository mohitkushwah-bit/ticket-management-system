import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Ticket, TicketStatus, TicketPriority, User } from '../types';
import { ticketService, TicketSortBy, SortOrder } from '../services/ticket.service';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { useRole } from '../hooks/useRole';
import { Button, LoadingSpinner, Card } from '../components/common';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { SearchFilter } from '../components/SearchFilter';

import './TicketListPage.css';

const PAGE_SIZE = 10;

export const TicketListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { canWrite } = useRole();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sortBy, setSortBy] = useState<TicketSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    userService.getAll().then(setUsers).catch((err) => {
      showToast('error', getApiErrorMessage(err, 'Failed to load users.'));
    });
  }, [showToast]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ticketService.getAll({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        assignedTo: assigneeFilter || undefined,
        sortBy,
        sortOrder,
        page,
        limit: PAGE_SIZE,
      });
      setTickets(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to load tickets.'));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, assigneeFilter, sortBy, sortOrder, page, showToast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearchChange = useCallback((value: string) => { setSearch(value); setPage(1); }, []);
  const handleStatusChange = useCallback((value: TicketStatus | '') => { setStatusFilter(value); setPage(1); }, []);
  const handlePriorityChange = useCallback((value: TicketPriority | '') => { setPriorityFilter(value); setPage(1); }, []);
  const handleAssigneeChange = useCallback((value: string) => { setAssigneeFilter(value); setPage(1); }, []);
  const handleSortChange = useCallback((newSortBy: TicketSortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  }, []);

  return (
    <div className="ticket-list-page">
      <div className="ticket-list-page__header">
        <div>
          <h1>Tickets</h1>
          <p className="ticket-list-page__count">{total} tickets total</p>
        </div>
        {canWrite && <Button onClick={() => navigate('/tickets/new')}>+ New Ticket</Button>}
      </div>

      <SearchFilter
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onAssigneeChange={handleAssigneeChange}
        onSortChange={handleSortChange}
        users={users}
        initialSearch={search}
        initialStatus={statusFilter}
        initialPriority={priorityFilter}
        initialAssignee={assigneeFilter}
        initialSort={`${sortBy}:${sortOrder}`}
      />

      {loading ? (
        <LoadingSpinner message="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <Card padding="lg">
          <p className="ticket-list-page__empty">No tickets found.</p>
        </Card>
      ) : (
        <>
          <div className="ticket-list-page__table-wrapper">
            <table className="ticket-list-page__table" role="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="ticket-list-page__row"
                  >
                    <td className="ticket-list-page__title-cell">
                      <Link to={`/tickets/${ticket.id}`} className="ticket-list-page__link">
                        {ticket.title}
                      </Link>
                    </td>
                    <td><StatusBadge status={ticket.status} size="sm" /></td>
                    <td><PriorityBadge priority={ticket.priority} size="sm" /></td>
                    <td className="ticket-list-page__date">
                      {new Date(ticket.createdAt).toLocaleDateString('en-AU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ticket-list-page__pagination" role="navigation" aria-label="Pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="ticket-list-page__page-info">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
