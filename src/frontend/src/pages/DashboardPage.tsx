import React, { useEffect, useState, useMemo } from 'react';

import { Card, LoadingSpinner } from '../components/common';
import { ticketService } from '../services/ticket.service';
import { getApiErrorMessage } from '../services/error-utils';
import { useToast } from '../context/ToastContext';
import { TicketStatus, STATUS_LABELS } from '../types';

import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const [statusCounts, setStatusCounts] = useState<Record<TicketStatus, number> | null>(null);
  const [resolvedCounts, setResolvedCounts] = useState({ week: 0, month: 0, year: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [counts, resolved] = await Promise.all([
          ticketService.getStatusCounts(),
          ticketService.getResolvedCounts(),
        ]);
        setStatusCounts(counts);
        setResolvedCounts(resolved);
      } catch (err) {
        showToast('error', getApiErrorMessage(err, 'Failed to load dashboard stats.'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  const totalTickets = useMemo(
    () => (statusCounts ? Object.values(statusCounts).reduce((sum, c) => sum + c, 0) : 0),
    [statusCounts],
  );

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <section className="dashboard__section">
        <h2>Resolved Tickets</h2>
        <div className="dashboard__stats-grid">
          <Card padding="lg" className="dashboard__stat-card">
            <span className="dashboard__stat-value">{resolvedCounts.week}</span>
            <span className="dashboard__stat-label">Last 7 Days</span>
          </Card>
          <Card padding="lg" className="dashboard__stat-card">
            <span className="dashboard__stat-value">{resolvedCounts.month}</span>
            <span className="dashboard__stat-label">Last 30 Days</span>
          </Card>
          <Card padding="lg" className="dashboard__stat-card">
            <span className="dashboard__stat-value">{resolvedCounts.year}</span>
            <span className="dashboard__stat-label">Last Year</span>
          </Card>
        </div>
      </section>

      <section className="dashboard__section">
        <h2>Tickets by Status</h2>
        <p className="dashboard__total">{totalTickets} total tickets</p>
        <div className="dashboard__status-grid">
          {statusCounts &&
            (Object.entries(statusCounts) as [TicketStatus, number][]).map(([status, count]) => (
              <Card key={status} padding="md" className="dashboard__status-card">
                <div
                  className="dashboard__status-indicator"
                  style={{ backgroundColor: `var(--color-status-${status.replace('_', '-')})` }}
                />
                <div className="dashboard__status-info">
                  <span className="dashboard__status-name">{STATUS_LABELS[status]}</span>
                  <span className="dashboard__status-count">{count}</span>
                </div>
                <div className="dashboard__status-bar">
                  <div
                    className="dashboard__status-bar-fill"
                    style={{
                      width: totalTickets > 0 ? `${(count / totalTickets) * 100}%` : '0%',
                      backgroundColor: `var(--color-status-${status.replace('_', '-')})`,
                    }}
                  />
                </div>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};
