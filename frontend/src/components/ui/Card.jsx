import React from 'react';

const Card = ({ children, className = '', hover = true, glass = false, style = {}, onClick }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: glass ? 'rgba(17,17,34,0.6)' : 'var(--bg-card)',
      backdropFilter: glass ? 'blur(20px)' : 'none',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={hover ? (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4),0 0 30px rgba(99,102,241,0.1)';
    } : undefined}
    onMouseLeave={hover ? (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'none';
    } : undefined}
  >
    {children}
  </div>
);

export default Card;
