import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { validateSignup, hasErrors } from '../../utils/validators';
import { isServerReady, getWakeElapsed } from '../../services/serverHealth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuthContext();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [serverReady, setServerReady] = useState(isServerReady());
  const [elapsed, setElapsed] = useState(0);

  // Poll server readiness every second for the banner timer
  useEffect(() => {
    if (serverReady) return;
    const interval = setInterval(() => {
      const ready = isServerReady();
      setElapsed(getWakeElapsed());
      if (ready) {
        setServerReady(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [serverReady]);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup(form);
    setErrors(errs);
    if (hasErrors(errs)) return;
    const res = await signup(form);
    if (res.success) navigate('/verify-otp', { state: { email: form.email } });
  };

  return (
    <div>
      {/* ── Server wake-up banner ── */}
      {!serverReady && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b22, #f59e0b11)',
          border: '1px solid #f59e0b55',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {/* Spinner */}
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '2px solid #f59e0b44',
            borderTop: '2px solid #f59e0b',
            animation: 'spin 1s linear infinite',
            flexShrink: 0,
          }} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#d97706' }}>
              Server is waking up… ({elapsed}s)
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e', marginTop: 2 }}>
              Free-tier servers sleep when idle. This takes up to 60 seconds. You can fill the form meanwhile.
            </p>
          </div>
        </div>
      )}

      {serverReady && elapsed > 0 && (
        <div style={{
          background: '#d1fae522',
          border: '1px solid #10b98155',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 24,
          fontSize: 13,
          color: '#065f46',
          fontWeight: 600,
        }}>
          ✅ Server is ready!
        </div>
      )}

      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Create account ✨</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Join TechVault and discover premium tech products
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Input label="Full Name" type="text" id="signup-name" placeholder="John Doe" value={form.name} onChange={set('name')} error={errors.name} required icon={<HiUser />} />
        <Input label="Email Address" type="email" id="signup-email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} required icon={<HiMail />} />
        <Input label="Password" type={showPwd ? 'text' : 'password'} id="signup-password" placeholder="Min. 8 chars, 1 uppercase, 1 number" value={form.password} onChange={set('password')} error={errors.password} required icon={<HiLockClosed />}
          iconRight={<button type="button" onClick={() => setShowPwd(!showPwd)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>{showPwd ? <HiEyeOff size={18} /> : <HiEye size={18} />}</button>}
        />
        <Input label="Confirm Password" type={showPwd ? 'text' : 'password'} id="signup-confirm" placeholder="Re-enter your password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} required icon={<HiLockClosed />} />

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -4 }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and{' '}
          <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.
        </p>

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? 'Please wait…' : 'Create Account'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
