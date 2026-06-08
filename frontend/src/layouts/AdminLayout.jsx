import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sideWidth = collapsed ? 70 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} />
      <div style={{ flex: 1, marginLeft: sideWidth, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Admin Top Bar */}
        <header style={{
          height: 'var(--nav-height)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            <HiMenuAlt3 size={18} />
          </button>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Admin Dashboard</span>
          <div style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20, fontSize: 12, color: 'var(--success)', fontWeight: 600,
          }}>
            ● Live
          </div>
        </header>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
