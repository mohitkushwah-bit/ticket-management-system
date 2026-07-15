import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { Input, Select } from './common';
import { TicketStatus, TicketPriority, STATUS_LABELS, PRIORITY_LABELS, User } from '../types';
import { TicketSortBy, SortOrder } from '../services/ticket.service';

import './SearchFilter.css';

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TicketStatus | '') => void;
  onPriorityChange: (priority: TicketPriority | '') => void;
  onAssigneeChange: (assignee: string) => void;
  onSortChange: (sortBy: TicketSortBy, sortOrder: SortOrder) => void;
  users?: User[];
  initialSearch?: string;
  initialStatus?: TicketStatus | '';
  initialPriority?: TicketPriority | '';
  initialAssignee?: string;
  initialSort?: string;
}

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'updatedAt:desc', label: 'Recently Updated' },
  { value: 'priority:desc', label: 'Priority (High → Low)' },
  { value: 'priority:asc', label: 'Priority (Low → High)' },
  { value: 'title:asc', label: 'Title (A → Z)' },
  { value: 'title:desc', label: 'Title (Z → A)' },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSortChange,
  users = [],
  initialSearch = '',
  initialStatus = '',
  initialPriority = '',
  initialAssignee = '',
  initialSort = 'createdAt:desc',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search to avoid firing API calls on every keystroke
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const statusOptions = useMemo(
    () => Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const priorityOptions = useMemo(
    () => Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const assigneeOptions = useMemo(
    () => users.map((u) => ({ value: u.id, label: u.name })),
    [users],
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  }, [onSearchChange]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split(':') as [TicketSortBy, SortOrder];
    onSortChange(sortBy, sortOrder);
  }, [onSortChange]);

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value as TicketStatus | ''),
    [onStatusChange],
  );
  const handlePriorityFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onPriorityChange(e.target.value as TicketPriority | ''),
    [onPriorityChange],
  );
  const handleAssigneeFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onAssigneeChange(e.target.value),
    [onAssigneeChange],
  );

  return (
    <div className="search-filter">
      <div className="search-filter__search">
        <Input
          placeholder="Search tickets..."
          value={search}
          onChange={handleSearchChange}
          aria-label="Search tickets by keyword"
        />
      </div>
      <div className="search-filter__status">
        <Select
          options={statusOptions}
          placeholder="All Statuses"
          value={initialStatus}
          onChange={handleStatusFilterChange}
          aria-label="Filter by status"
        />
      </div>
      <div className="search-filter__priority">
        <Select
          options={priorityOptions}
          placeholder="All Priorities"
          value={initialPriority}
          onChange={handlePriorityFilterChange}
          aria-label="Filter by priority"
        />
      </div>
      <div className="search-filter__assignee">
        <Select
          options={assigneeOptions}
          placeholder="All Assignees"
          value={initialAssignee}
          onChange={handleAssigneeFilterChange}
          aria-label="Filter by assignee"
        />
      </div>
      <div className="search-filter__sort">
        <Select
          options={SORT_OPTIONS}
          value={initialSort}
          onChange={handleSortChange}
          aria-label="Sort tickets"
        />
      </div>
    </div>
  );
};
