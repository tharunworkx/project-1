import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.65 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem', height: '32px' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem', height: '40px' },
    lg: { padding: '0.625rem 1.25rem', fontSize: '1rem', height: '46px' },
  };

  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      color: '#334155',
      borderColor: '#e2e8f0',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#475569',
      borderColor: '#cbd5e1',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderColor: '#dc2626',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)',
    },
    success: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      borderColor: '#059669',
      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
      borderColor: 'transparent',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...(sizes[size] || sizes.md),
    ...(variants[variant] || variants.primary),
  };

  return (
    <button
      type={type}
      style={combinedStyles}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-component ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 18} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </button>
  );
};

export default Button;
