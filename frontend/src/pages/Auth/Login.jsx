import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { validateLogin, hasErrors } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
      navigate('/');
    }
  };

  return (
    <div>
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
