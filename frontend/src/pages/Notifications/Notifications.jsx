import React from 'react';
import { HiCheck, HiTrash, HiCheckCircle } from 'react-icons/hi';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDateTime } from '../../utils/helpers';

const icons = { order: '📦', promo: '🏷️', product: '✨', default: '🔔' };

const Notifications = () => {
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification } = useNotifications();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 40, paddingBottom: 60 }}>
      <div className="container-sm">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Notifications</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <HiCheckCircle size={16} /> Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🔔</div>
            <h3 className="empty-state-title">No notifications</h3>
            <p className="empty-state-text">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: 20,
                background: n.read ? 'var(--bg-card)' : 'rgba(99,102,241,0.04)',
                border: `1px solid ${n.read ? 'var(--border)' : 'rgba(99,102,241,0.15)'}`,
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
                onClick={() => markRead(n.id)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = n.read ? 'var(--border)' : 'rgba(99,102,241,0.15)'}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {icons[n.type] || icons.default}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: n.read ? 600 : 800, color: 'var(--text-primary)' }}>{n.title}</p>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{n.message}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.time}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {!n.read && (
                    <button onClick={(e) => { e.stopPropagation(); markRead(n.id); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)', cursor: 'pointer' }}>
                      <HiCheck size={14} />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'var(--error-light)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--error)', cursor: 'pointer' }}>
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
