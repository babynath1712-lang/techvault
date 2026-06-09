import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { validateLogin, hasErrors } from '../../utils/validators';
import { isServerReady, getWakeElapsed } from '../../services/serverHealth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthContext();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [serverReady, setServerReady] = useState(isServerReady());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (serverReady) return;
    const interval = setInterval(() => {
      const ready = isServerReady();
      setElapsed(getWakeElapsed());
      if (ready) { setServerReady(true); clearInterval(interval); }
    }, 1000);
    return () => clearInterval(interval);
  }, [serverReady]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (hasErrors(errs)) return;
    const res = await login(form);
    if (res.success) {
      // Redirect admin users to admin dashboard, others to home
      navigate(res.user?.role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div>
      {/* ── Server wake-up banner ── */}
      {!serverReady && (
        <div style={{ background: 'linear-gradient(135deg,#f59e0b22,#f59e0b11)', border: '1px solid #f59e0b55', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #f59e0b44', borderTop: '2px solid #f59e0b', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#d97706' }}>Server is waking up… ({elapsed}s)</p>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e', marginTop: 2 }}>Free-tier servers sleep when idle. This takes up to 60 seconds.</p>
          </div>
        </div>
      )}
      {serverReady && elapsed > 0 && (
        <div style={{ background: '#d1fae522', border: '1px solid #10b98155', borderRadius: 12, padding: '10px 16px', marginBottom: 24, fontSize: 13, color: '#065f46', fontWeight: 600 }}>✅ Server is ready!</div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Welcome back 👋</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Sign in to your TechVault account
      </p>

      {/* ── Login Form ── */}
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
