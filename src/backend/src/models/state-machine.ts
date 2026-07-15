import { TicketStatus } from './types';

/**
 * Valid state transitions for the ticket status state machine.
 * Key: current status → Value: array of valid next statuses.
 */
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};

/**
 * Check if a status transition is valid according to the state machine rules.
 */
export function isValidTransition(
  currentStatus: TicketStatus,
  newStatus: TicketStatus,
): boolean {
  return VALID_TRANSITIONS[currentStatus].includes(newStatus);
}

/**
 * Get all valid next statuses for a given current status.
 */
export function getValidTransitions(currentStatus: TicketStatus): TicketStatus[] {
  return VALID_TRANSITIONS[currentStatus];
}

/**
 * Check if a status is a terminal state (no further transitions possible).
 */
export function isTerminalState(status: TicketStatus): boolean {
  return VALID_TRANSITIONS[status].length === 0;
}
