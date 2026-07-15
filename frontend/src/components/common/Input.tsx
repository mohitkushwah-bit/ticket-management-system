import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
          {props.required && <span className="input-group__required" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className="input-group__input"
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-group__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="input-group__helper">{helperText}</span>
      )}
    </div>
  );
};
