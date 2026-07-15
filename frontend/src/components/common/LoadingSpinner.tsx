import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
}) => {
  return (
    <div className="loading" role="status" aria-label={message || 'Loading'}>
      <div className={`loading__spinner loading__spinner--${size}`} />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
};
