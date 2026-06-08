import React, { useState } from 'react';
import { HiUser, HiMail, HiPhone, HiPencil, HiSave } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Profile updated!');
    setEditing(false);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 40, paddingBottom: 60 }}>
      <div className="container-sm">
        {/* Hero */}
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 900, color: '#fff',
              margin: '0 auto 20px',
              boxShadow: 'var(--shadow-glow)',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 12 }}>{user?.email}</p>
            <span style={{ padding: '5px 16px', background: user?.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'var(--success-light)', border: `1px solid ${user?.role === 'admin' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 20, fontSize: 13, fontWeight: 700, color: user?.role === 'admin' ? 'var(--primary)' : 'var(--success)' }}>
              {user?.role === 'admin' ? '🛡️ Administrator' : '👤 Member'}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Account Details</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <HiPencil size={15} /> Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input label="Full Name" id="profile-name" value={form.name} onChange={set('name')} icon={<HiUser />} required />
              <Input label="Email" id="profile-email" type="email" value={form.email} onChange={set('email')} icon={<HiMail />} required />
              <Input label="Phone" id="profile-phone" value={form.phone} onChange={set('phone')} icon={<HiPhone />} placeholder="+91 98765 43210" />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Button type="submit" loading={loading} icon={<HiSave size={16} />}>Save Changes</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { icon: <HiUser />, label: 'Full Name', value: user?.name },
                { icon: <HiMail />, label: 'Email', value: user?.email },
                { icon: <HiPhone />, label: 'Phone', value: user?.phone || 'Not set' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ padding: '16px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                    <span style={{ fontSize: 16, color: 'var(--primary)' }}>{icon}</span>
                    {label}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
