import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { adminService } from '../../services/adminService';
import { formatPriceShort } from '../../utils/helpers';

const STATUS = {
  delivered:  ['var(--success)', 'var(--success-light)'],
  shipped:    ['#3b82f6', 'rgba(59,130,246,0.1)'],
  processing: ['var(--warning)', 'var(--warning-light)'],
  cancelled:  ['var(--error)', 'var(--error-light)'],
  pending:    ['#f59e0b', 'rgba(245,158,11,0.1)'],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]       = useState(null);
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminService.getDashboard(),
      adminService.getOrders({ limit: 5, sort: '-createdAt' }),
    ]).then(([dashRes, ordersRes]) => {
      if (dashRes.status === 'fulfilled') {
        const d = dashRes.value?.data || dashRes.value;
        setStats(d);
        setProducts(d?.topProducts || []);
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value?.data?.orders || ordersRes.value?.orders || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  const ADMIN_STATS = [
    { icon: '📦', label: 'Total Products', value: stats?.totalProducts ?? '…', change: stats?.newProductsToday ?? 0, color: '#6366f1', path: '/admin/products' },
    { icon: '👤', label: 'Total Users',    value: stats?.totalUsers    ?? '…', change: stats?.newUsersToday    ?? 0, color: '#10b981', path: '/admin/users' },
    { icon: '🛒', label: 'Total Orders',   value: stats?.totalOrders   ?? '…', change: stats?.ordersToday      ?? 0, color: '#f59e0b', path: '/admin/orders' },
    { icon: '💰', label: 'Total Revenue',  value: stats?.totalRevenue  ? formatPriceShort(stats.totalRevenue) : '…', change: stats?.revenueToday ? formatPriceShort(stats.revenueToday) : 0, color: '#06b6d4', path: '/admin/payments' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
        {ADMIN_STATS.map(({ icon, label, value, change, color, path }) => (
          <div key={label} onClick={() => navigate(path)} style={{
            padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', cursor: 'pointer', transition: 'all 0.25s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3),0 0 20px ${color}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {icon}
              </div>
              {change > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', background: 'var(--success-light)', padding: '4px 10px', borderRadius: 20 }}>
                  +{change} today
                </span>
              )}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>
              {loading ? '…' : value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }} className="admin-overview-grid">
        {/* Recent Orders */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontWeight: 600 }}>
              View All <HiArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>No orders yet</div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const status = (o.status || 'pending').toLowerCase();
                    return (
                      <tr key={o._id}>
                        <td style={{ color: 'var(--primary)', fontWeight: 700 }}>#{o._id?.slice(-6).toUpperCase()}</td>
                        <td style={{ fontSize: 13 }}>{o.user?.name || 'Customer'}</td>
                        <td style={{ fontWeight: 700, fontSize: 13 }}>{formatPriceShort(o.total_amount)}</td>
                        <td>
                          <span style={{ padding: '3px 10px', background: STATUS[status]?.[1] || 'var(--bg-elevated)', color: STATUS[status]?.[0] || 'var(--text-muted)', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Top Products</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Loading…</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>No product data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {products.slice(0, 5).map((p, i) => (
                <div key={p._id || i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: i === 0 ? '#f59e0b' : 'var(--text-muted)', width: 20 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.total_sold || 0} sold</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                    {formatPriceShort(p.revenue || p.price || 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width:900px) { .admin-overview-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
