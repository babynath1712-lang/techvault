import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiLightningBolt, HiShieldCheck } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { validateLogin, hasErrors } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const QUICK_LOGIN = [
  {
    label: 'Login as User',
    icon: <HiLightningBolt size={15} />,
    email: 'user@demo.com',
    password: 'Demo@1234',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    badge: '👤 User',
  },
  {
    label: 'Login as Admin',
    icon: <HiShieldCheck size={15} />,
    email: 'admin@demo.com',
    password: 'Admin@1234',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
    badge: '🛡️ Admin',
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthContext();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (hasErrors(errs)) return;
    const res = await login(form);
    if (res.success) {
      // Admin goes to admin dashboard, user goes to home
      navigate(form.email === 'admin@demo.com' ? '/admin' : '/');
    }
  };

  const handleQuickLogin = async (creds) => {
    setForm({ email: creds.email, password: creds.password });
    const res = await login({ email: creds.email, password: creds.password });
    if (res.success) {
      navigate(creds.email === 'admin@demo.com' ? '/admin' : '/');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Welcome back 👋</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Sign in to your TechVault account
      </p>

      {/* ── Quick Login Buttons ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Quick Demo Login
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {QUICK_LOGIN.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => handleQuickLogin(q)}
              disabled={loading}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: 6, padding: '14px 16px',
                background: q.bg,
                border: `1.5px solid ${q.border}`,
                borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease', textAlign: 'left',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = q.color + '60';
                e.currentTarget.style.boxShadow = `0 8px 24px ${q.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = q.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: q.color }}>{q.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: q.color }}>{q.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>📧 {q.email}</span>
                <span>🔑 {q.password}</span>
              </div>
              <span style={{
                marginTop: 4, padding: '2px 10px', borderRadius: 20,
                background: q.color + '18', color: q.color,
                fontSize: 11, fontWeight: 700,
              }}>
                {q.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>or sign in manually</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── Manual Form ── */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Email Address" type="email" id="login-email"
          placeholder="you@example.com" value={form.email}
          onChange={set('email')} error={errors.email} required
          icon={<HiMail />}
        />
        <Input
          label="Password" type={showPwd ? 'text' : 'password'} id="login-password"
          placeholder="Enter your password" value={form.password}
          onChange={set('password')} error={errors.password} required
          icon={<HiLockClosed />}
          iconRight={
            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPwd ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          }
        />

        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Sign In
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
