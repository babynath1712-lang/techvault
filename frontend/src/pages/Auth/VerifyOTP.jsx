import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const DEMO_OTP = '123456'; // mock OTP for demo

const VerifyOTP = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (code !== DEMO_OTP) {
      toast.error(`Wrong OTP. Demo code is: ${DEMO_OTP}`);
      setLoading(false);
      return;
    }
    toast.success('OTP verified! ✅');
    navigate('/reset-password', { state: { email, otp: code } });
    setLoading(false);
  };

  const handleResend = () => {
    toast.success(`OTP resent! Use code: ${DEMO_OTP}`);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Enter OTP</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
        We sent a 6-digit code to
      </p>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 36 }}>{email}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 52, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 800,
                background: 'var(--bg-secondary)',
                border: `2px solid ${digit ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">Verify OTP</Button>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          Didn't receive?{' '}
          <button type="button" onClick={handleResend} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 13 }}>
            Resend OTP
          </button>
        </p>
      </form>
    </div>
  );
};

export default VerifyOTP;
