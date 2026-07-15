import React, { useState, useMemo } from 'react';

import { Input, TextArea, Select, Button } from './common';
import { TicketPriority, User, PRIORITY_LABELS } from '../types';

import './TicketForm.css';

interface TicketFormData {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedTo: string;
  prLink: string;
}

interface TicketFormProps {
  initialValues?: Partial<TicketFormData>;
  users: User[];
  onSubmit: (data: TicketFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  initialValues,
  users,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Create Ticket',
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'medium',
    assignedTo: initialValues?.assignedTo || '',
    prLink: initialValues?.prLink || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 255) newErrors.title = 'Title must be 255 characters or less';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.prLink && !/^https?:\/\/.+/.test(formData.prLink)) {
      newErrors.prLink = 'Must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const priorityOptions = useMemo(
    () => Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ value: u.id, label: u.name })),
    [users],
  );

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        required
        value={formData.title}
        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
        error={errors.title}
        maxLength={255}
      />

      <TextArea
        label="Description"
        required
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        error={errors.description}
        rows={5}
      />

      <div className="ticket-form__row">
        <Select
          label="Priority"
          required
          options={priorityOptions}
          value={formData.priority}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, priority: e.target.value as TicketPriority }))
          }
        />

        <Select
          label="Assignee"
          options={userOptions}
          placeholder="Unassigned"
          value={formData.assignedTo}
          onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))}
        />
      </div>

      <Input
        label="PR Link"
        type="url"
        placeholder="https://github.com/..."
        value={formData.prLink}
        onChange={(e) => setFormData((prev) => ({ ...prev, prLink: e.target.value }))}
        error={errors.prLink}
      />

      <div className="ticket-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
