import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import { authService } from '../../services/authService';
import { isEmail } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = isEmail(email);
    setError(err);
    if (err) return;
    setLoading(true);
    // Mock: no real email sent, just navigate with demo OTP info
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    toast.success('OTP sent! Use code: 123456');
    setTimeout(() => navigate('/verify-otp', { state: { email } }), 2000);
    setLoading(false);
  };

  if (sent) return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>📧</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Check your email</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>
        We've sent an OTP to <strong style={{ color: 'var(--primary)' }}>{email}</strong>
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Redirecting to OTP verification…</p>
    </div>
  );

  return (
    <div>
      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32, textDecoration: 'none' }}>
        <HiArrowLeft size={16} /> Back to Login
      </Link>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Forgot password? 🔑</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Enter your email and we'll send you a one-time password.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input label="Email Address" type="email" id="forgot-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} required icon={<HiMail />} />
        <Button type="submit" loading={loading} fullWidth size="lg">Send OTP</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
