import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({
  fullPage = false,
  message = 'Loading data...',
  size = 'md',
  type = 'spinner', // 'spinner' | 'skeleton'
}) => {
  const iconSizes = {
    sm: 18,
    md: 28,
    lg: 42,
  };

  if (type === 'skeleton') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        <div style={{ height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '40%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '80px', backgroundColor: '#f1f5f9', borderRadius: '8px', width: '100%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '80px', backgroundColor: '#f1f5f9', borderRadius: '8px', width: '100%', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2rem',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2
        size={iconSizes[size] || iconSizes.md}
        style={{
          color: 'var(--primary-600)',
          animation: 'spin 1s linear infinite',
        }}
      />
      {message && <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
