import React, { useState, useEffect } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sideWidth = isMobile ? 0 : (collapsed ? 70 : 260);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar — fixed on desktop, sliding overlay on mobile */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 201,
        transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease, width 0.3s ease',
        width: isMobile ? 260 : (collapsed ? 70 : 260),
      }}>
        <Sidebar collapsed={isMobile ? false : collapsed} />
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1,
        marginLeft: sideWidth,
        transition: 'margin-left 0.3s ease',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
      }}>
        {/* Admin Top Bar */}
        <header style={{
          height: 'var(--nav-height)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 12,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => isMobile ? setMobileOpen(!mobileOpen) : setCollapsed(!collapsed)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            {isMobile && mobileOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
          </button>

          <span style={{ fontSize: 14, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Admin Dashboard
          </span>

          <div style={{
            marginLeft: 'auto', flexShrink: 0,
            padding: '4px 12px',
            background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20, fontSize: 12, color: 'var(--success)', fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            ● Live
          </div>
        </header>

        <main style={{ flex: 1, padding: isMobile ? 12 : 24, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
