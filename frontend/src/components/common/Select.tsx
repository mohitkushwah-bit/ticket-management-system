import React from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`select-group ${error ? 'select-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-group__label">
          {label}
          {props.required && <span className="select-group__required" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className="select-group__select"
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="select-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
