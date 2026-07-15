import React from 'react';

import { Badge } from './common';
import { TicketStatus, TicketPriority, STATUS_LABELS, PRIORITY_LABELS } from '../types';

const STATUS_VARIANT: Record<TicketStatus, 'info' | 'warning' | 'success' | 'default' | 'error'> = {
  open: 'info',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
  cancelled: 'error',
};

const PRIORITY_VARIANT: Record<TicketPriority, 'default' | 'info' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  critical: 'error',
};

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ status, size = 'md' }) => (
  <Badge variant={STATUS_VARIANT[status]} size={size}>
    {STATUS_LABELS[status]}
  </Badge>
));

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = React.memo(({ priority, size = 'md' }) => (
  <Badge variant={PRIORITY_VARIANT[priority]} size={size}>
    {PRIORITY_LABELS[priority]}
  </Badge>
));
