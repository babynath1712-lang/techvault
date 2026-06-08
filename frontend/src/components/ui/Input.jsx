import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  iconRight,
  disabled = false,
  required = false,
  className = '',
  style = {},
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.02em',
        }}>
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 14, color: 'var(--text-muted)',
            fontSize: 16, display: 'flex', alignItems: 'center', pointerEvents: 'none',
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={className}
          style={{
            width: '100%',
            padding: icon ? '12px 16px 12px 42px' : iconRight ? '12px 42px 12px 16px' : '12px 16px',
            background: 'var(--bg-secondary)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 15,
            transition: 'var(--transition)',
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary)';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(239,68,68,0.12)'
              : '0 0 0 3px rgba(99,102,241,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {iconRight && (
          <span style={{
            position: 'absolute', right: 14, color: 'var(--text-muted)',
            fontSize: 16, display: 'flex', alignItems: 'center',
          }}>
            {iconRight}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--error)', marginTop: 2 }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
