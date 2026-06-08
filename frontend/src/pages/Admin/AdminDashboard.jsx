import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiShoppingBag, HiUsers, HiCreditCard, HiClipboardList, HiTrendingUp, HiArrowRight } from 'react-icons/hi';
import { PRODUCTS } from '../../utils/constants';
import { formatPriceShort } from '../../utils/helpers';

const ADMIN_STATS = [
  { icon: '📦', label: 'Total Products', value: 23, change: '+2', color: '#6366f1', path: '/admin/products' },
  { icon: '👤', label: 'Total Users', value: '1,284', change: '+48', color: '#10b981', path: '/admin/users' },
  { icon: '🛒', label: 'Orders Today', value: 38, change: '+12', color: '#f59e0b', path: '/admin/orders' },
  { icon: '💰', label: 'Revenue Today', value: '₹8.4L', change: '+₹1.2L', color: '#06b6d4', path: '/admin/payments' },
];

const RECENT_ORDERS = [
  { id: 'ORD-001', user: 'Arjun Kumar', product: 'iPhone 16', amount: 89999, status: 'Delivered', time: '10:32 AM' },
  { id: 'ORD-002', user: 'Priya Sharma', product: 'Sony WH-1000XM6', amount: 34999, status: 'Shipped', time: '11:15 AM' },
  { id: 'ORD-003', user: 'Rohan Singh', product: 'MacBook Pro M4', amount: 199999, status: 'Processing', time: '12:48 PM' },
  { id: 'ORD-004', user: 'Ananya Gupta', product: 'Samsung Galaxy S24 Ultra', amount: 129999, status: 'Delivered', time: '1:20 PM' },
  { id: 'ORD-005', user: 'Vikram Patel', product: 'Apple Watch Series 10', amount: 46999, status: 'Cancelled', time: '2:05 PM' },
];

const STATUS = { Delivered: ['var(--success)','var(--success-light)'], Shipped: ['#3b82f6','rgba(59,130,246,0.1)'], Processing: ['var(--warning)','var(--warning-light)'], Cancelled: ['var(--error)','var(--error-light)'] };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const topProducts = PRODUCTS.sort((a, b) => b.reviews - a.reviews).slice(0, 5);

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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', background: 'var(--success-light)', padding: '4px 10px', borderRadius: 20 }}>
                {change} today
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>{value}</div>
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
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id}>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{o.id}</td>
                    <td style={{ fontSize: 13 }}>{o.user}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.product}</td>
                    <td style={{ fontWeight: 700, fontSize: 13 }}>{formatPriceShort(o.amount)}</td>
                    <td>
                      <span style={{ padding: '3px 10px', background: STATUS[o.status]?.[1], color: STATUS[o.status]?.[0], borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Top Products</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: i === 0 ? '#f59e0b' : 'var(--text-muted)', width: 20 }}>
                  {i + 1}
                </span>
                <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, background: 'var(--bg-elevated)', padding: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.reviews.toLocaleString()} reviews</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                  ⭐ {p.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:900px) { .admin-overview-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
