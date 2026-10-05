import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  dot = false,
  size = 'md',
  className = '',
}) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    letterSpacing: '0.02em',
    lineHeight: '1',
    userSelect: 'none',
  };

  const sizes = {
    sm: { padding: '0.2rem 0.5rem', fontSize: '0.6875rem' },
    md: { padding: '0.25rem 0.625rem', fontSize: '0.75rem' },
    lg: { padding: '0.35rem 0.85rem', fontSize: '0.8125rem' },
  };

  const variants = {
    success: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-text)',
      border: '1px solid var(--success-border)',
      dotColor: '#10b981',
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning-text)',
      border: '1px solid var(--warning-border)',
      dotColor: '#f59e0b',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger-text)',
      border: '1px solid var(--danger-border)',
      dotColor: '#ef4444',
    },
    info: {
      backgroundColor: 'var(--info-bg)',
      color: 'var(--info-text)',
      border: '1px solid var(--info-border)',
      dotColor: '#0ea5e9',
    },
    purple: {
      backgroundColor: 'var(--purple-bg)',
      color: 'var(--purple-text)',
      border: '1px solid var(--purple-border)',
      dotColor: '#8b5cf6',
    },
    neutral: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #e2e8f0',
      dotColor: '#94a3b8',
    },
  };

  const currentVariant = variants[variant] || variants.neutral;

  return (
    <span
      style={{
        ...styles,
        ...(sizes[size] || sizes.md),
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        border: currentVariant.border,
      }}
      className={`badge-component ${className}`}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentVariant.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
