import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      className={`card card--pad-${padding} ${hoverable ? 'card--hoverable' : ''} ${className}`}
      onClick={onClick}
      {...(onClick && { type: 'button' as const })}
    >
      {children}
    </Component>
  );
};
