import React, { useState, useRef, useEffect } from 'react';
import { HiBell } from 'react-icons/hi';
import { useNotifications } from '../hooks/useNotifications';

const icons = { order: '📦', promo: '🏷️', product: '✨', default: '🔔' };

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification } = useNotifications();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: 10,
          background: unreadCount > 0 ? 'rgba(99,102,241,0.12)' : 'transparent',
          border: `1px solid ${unreadCount > 0 ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
          color: unreadCount > 0 ? 'var(--primary)' : 'var(--text-secondary)',
          cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease',
        }}
      >
        <HiBell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: 'var(--error)', color: '#fff',
            fontSize: 10, fontWeight: 700,
            width: 18, height: 18, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
            animation: 'pulse 2s infinite',
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 340, background: 'var(--bg-elevated)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', zIndex: 200,
          animation: 'scaleIn 0.2s ease', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--primary)', color: '#fff',
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                }}>{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 18px', cursor: 'pointer',
                    background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(99,102,241,0.05)'}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icons[n.type] || icons.default}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', marginBottom: 2 }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
