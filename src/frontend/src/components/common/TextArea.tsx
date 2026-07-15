import React from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`textarea-group ${error ? 'textarea-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-group__label">
          {label}
          {props.required && <span className="textarea-group__required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className="textarea-group__textarea"
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="textarea-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
