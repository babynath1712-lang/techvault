import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { isStrongPassword } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { email, otp } = location.state || {};
  const [form, setForm]     = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    errs.password = isStrongPassword(form.password);
    errs.confirmPassword = form.password !== form.confirmPassword ? 'Passwords do not match.' : '';
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Password reset successfully! Please login.');
    navigate('/login');
    setLoading(false);
  };

  const eyeBtn = (
    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
      {showPwd ? <HiEyeOff size={18} /> : <HiEye size={18} />}
    </button>
  );

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Reset Password 🔒</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Choose a strong new password for your account.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input label="New Password" type={showPwd ? 'text' : 'password'} id="reset-pwd" placeholder="Min. 8 chars, 1 uppercase, 1 number" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} required icon={<HiLockClosed />} iconRight={eyeBtn} />
        <Input label="Confirm Password" type={showPwd ? 'text' : 'password'} id="reset-confirm" placeholder="Re-enter new password" value={form.confirmPassword} onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))} error={errors.confirmPassword} required icon={<HiLockClosed />} />
        <Button type="submit" loading={loading} fullWidth size="lg">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
