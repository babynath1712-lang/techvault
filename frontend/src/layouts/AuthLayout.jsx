import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Background Art */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--gradient-hero)',
      pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(rgba(99,102,241,0.1) 1px,transparent 1px)',
      backgroundSize: '28px 28px',
      pointerEvents: 'none',
    }} />

    {/* Left Panel (hidden on mobile) */}
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 48, position: 'relative',
    }} className="auth-left-panel">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, textDecoration: 'none' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: '#fff', boxShadow: 'var(--shadow-glow)',
        }}>⚡</div>
        <span style={{
          fontSize: 28, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif",
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>TechVault</span>
      </Link>

      <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, textAlign: 'center', maxWidth: 420 }}>
        Your premium tech marketplace
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 360, lineHeight: 1.7, marginBottom: 40 }}>
        23 premium products from the world's top brands. Delivered right to your door.
      </p>

      {[
        { emoji: '🚀', text: 'Fastest delivery in India' },
        { emoji: '🔒', text: 'Secure & encrypted payments' },
        { emoji: '⭐', text: 'Genuine products guaranteed' },
        { emoji: '🔄', text: 'Easy 30-day returns' },
      ].map(({ emoji, text }) => (
        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', width: '100%', maxWidth: 320 }}>
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</span>
        </div>
      ))}
    </div>

    {/* Right Panel - Form */}
    <div style={{
      width: '100%', maxWidth: 520,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, position: 'relative',
    }}>
      <div style={{
        width: '100%',
        background: 'rgba(17,17,34,0.8)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        padding: '40px 40px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeInRight 0.5s ease',
      }}>
        {/* Mobile Logo */}
        <Link to="/" style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }} className="auth-mobile-logo">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>⚡</div>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TechVault</span>
        </Link>
        {children}
      </div>
    </div>

    <style>{`
      @media (max-width:768px) {
        .auth-left-panel { display:none !important; }
        .auth-mobile-logo { display:flex !important; }
      }
    `}</style>
  </div>
);

export default AuthLayout;
