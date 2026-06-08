import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiHome, HiShoppingBag, HiUsers, HiCreditCard,
  HiClipboardList, HiChartBar, HiCog, HiLogout,
} from 'react-icons/hi';
import { useAuthContext } from '../context/AuthContext';

const LINKS = [
  { icon: HiHome,          label: 'Overview',        path: '/admin' },
  { icon: HiShoppingBag,   label: 'Products',        path: '/admin/products' },
  { icon: HiClipboardList, label: 'Orders',          path: '/admin/orders' },
  { icon: HiUsers,         label: 'Users',           path: '/admin/users' },
  { icon: HiCreditCard,    label: 'Payments',        path: '/admin/payments' },
];

const Sidebar = ({ collapsed = false }) => {
  const { user, logout } = useAuthContext();

  return (
    <aside style={{
      width: collapsed ? 70 : 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        height: 'var(--nav-height)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', borderBottom: '1px solid var(--border)',
        gap: 12, overflow: 'hidden',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#fff', fontWeight: 900,
        }}>⚡</div>
        {!collapsed && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>TechVault</p>
            <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Profile */}
      {!collapsed && (
        <div style={{
          margin: 16, padding: 16,
          background: 'var(--primary-light)', borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: '#fff',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px 12px' }}>
            Navigation
          </p>
        )}
        {LINKS.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} end={path === '/admin'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px' : '10px 12px',
            borderRadius: 10, marginBottom: 4,
            background: isActive ? 'var(--primary-light)' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
            textDecoration: 'none', fontWeight: isActive ? 600 : 400, fontSize: 14,
            transition: 'all 0.15s ease',
            border: `1px solid ${isActive ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
            justifyContent: collapsed ? 'center' : 'flex-start',
          })}
            onMouseEnter={(e) => { if (!e.currentTarget.style.background.includes('primary')) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
            onMouseLeave={(e) => { if (!e.currentTarget.style.background.includes('primary')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 20px 24px' }}>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '10px 12px',
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 10, color: 'var(--error)', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s ease',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--error-light)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <HiLogout size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
