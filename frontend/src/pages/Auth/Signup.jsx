import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { validateSignup, hasErrors } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuthContext();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

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
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Create account ✨</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Join TechVault and discover premium tech products
      </p>

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

        <Button type="submit" loading={loading} fullWidth size="lg">Create Account</Button>
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
