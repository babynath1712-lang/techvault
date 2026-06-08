import React from 'react';

const variants = {
  primary: {
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--primary)',
    border: '1px solid rgba(99,102,241,0.4)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--error-light)',
    color: 'var(--error)',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  success: {
    background: 'var(--success-light)',
    color: 'var(--success)',
    border: '1px solid rgba(16,185,129,0.3)',
  },
  accent: {
    background: 'var(--gradient-accent)',
    color: '#fff',
    border: 'none',
  },
};

const sizes = {
  xs: { padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-sm)', gap: '5px' },
  sm: { padding: '8px 18px', fontSize: '13px', borderRadius: 'var(--radius-md)', gap: '6px' },
  md: { padding: '12px 24px', fontSize: '14px', borderRadius: 'var(--radius-md)', gap: '8px' },
  lg: { padding: '14px 32px', fontSize: '16px', borderRadius: 'var(--radius-lg)', gap: '10px' },
  xl: { padding: '16px 40px', fontSize: '17px', borderRadius: 'var(--radius-lg)', gap: '10px' },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...props
}) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: s.borderRadius,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'inherit',
        letterSpacing: '0.01em',
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {loading ? (
        <span style={{
          width: 16, height: 16,
          border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid #fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      ) : icon}
      {loading ? 'Loading…' : children}
      {!loading && iconRight}
    </button>
  );
};

export default Button;
