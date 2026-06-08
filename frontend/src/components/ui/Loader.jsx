import React from 'react';

const Loader = ({ size = 'md', text = '', fullScreen = false }) => {
  const sizes = { sm: 24, md: 40, lg: 60, xl: 80 };
  const px = sizes[size] || sizes.md;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: px, height: px }}>
        <div style={{
          width: px, height: px, borderRadius: '50%',
          border: `${px * 0.1}px solid rgba(99,102,241,0.15)`,
          borderTop: `${px * 0.1}px solid var(--primary)`,
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: '15%',
          borderRadius: '50%',
          border: `${px * 0.07}px solid rgba(6,182,212,0.2)`,
          borderBottom: `${px * 0.07}px solid var(--accent)`,
          animation: 'spin 1.2s linear infinite reverse',
        }} />
      </div>
      {text && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, animation: 'pulse 2s infinite' }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', zIndex: 9999,
    }}>
      {spinner}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      {spinner}
    </div>
  );
};

export const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
  }}>
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton" style={{ height: 16, width: '60%' }} />
      <div className="skeleton" style={{ height: 14, width: '80%' }} />
      <div className="skeleton" style={{ height: 24, width: '40%' }} />
    </div>
  </div>
);

export default Loader;
