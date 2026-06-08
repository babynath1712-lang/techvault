import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiShoppingCart, HiClock, HiTruck } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { formatPriceShort } from '../../utils/helpers';
import ProductCard from '../../components/ProductCard';
import { orderService } from '../../services/orderService';

const statusColors = { delivered: 'var(--success)', shipped: 'var(--info)', processing: 'var(--warning)', cancelled: 'var(--error)', pending: '#f59e0b' };
const statusBg     = { delivered: 'var(--success-light)', shipped: 'rgba(59,130,246,0.1)', processing: 'var(--warning-light)', cancelled: 'var(--error-light)', pending: 'rgba(245,158,11,0.1)' };

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, cart, cartTotal, wishlist, removeFromCart, updateCartQty } = useAuthContext();
  const [orders, setOrders]   = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    orderService.getMyOrders({ limit: 5 })
      .then(res => setOrders(res.data?.orders || res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const STATS = [
    { icon: '📦', label: 'Total Orders',  value: orders.length,                                color: '#6366f1' },
    { icon: '❤️', label: 'Wishlist',       value: wishlist.length,                              color: '#f43f5e' },
    { icon: '🛒', label: 'Cart Items',    value: cart.reduce((s, i) => s + i.quantity, 0),      color: '#10b981' },
    { icon: '💰', label: 'Cart Value',    value: formatPriceShort(cartTotal),                   color: '#f59e0b' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 60, paddingTop: 32 }}>
      <div className="container">
        {/* Welcome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Here's what's happening with your account</p>
          </div>
          <button onClick={() => navigate('/products')} style={{ padding: '10px 24px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Shop Now →
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20, marginBottom: 40 }}>
          {STATS.map(({ icon, label, value, color }) => (
            <div key={label} style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="dashboard-grid">
          {/* Recent Orders */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HiClock size={20} style={{ color: 'var(--primary)' }} /> Recent Orders
            </h2>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div style={{ fontSize: 32 }}>📦</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No orders yet</p>
                <button onClick={() => navigate('/products')} style={{ padding: '8px 20px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Browse Products</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map(order => {
                  const status = (order.status || 'pending').toLowerCase();
                  const item = order.items?.[0];
                  return (
                    <div key={order._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: 'var(--bg-elevated)', borderRadius: 12 }}>
                      <div style={{ width: 52, height: 52, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item?.product_name || `Order #${order._id?.slice(-6).toUpperCase()}`}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {order._id?.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{formatPriceShort(order.total_amount)}</p>
                        <span style={{ padding: '3px 10px', background: statusBg[status] || 'var(--bg-elevated)', color: statusColors[status] || 'var(--text-muted)', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HiShoppingCart size={20} style={{ color: 'var(--primary)' }} /> Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div style={{ fontSize: 32 }}>🛒</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Your cart is empty</p>
                <button onClick={() => navigate('/products')} style={{ padding: '8px 20px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Browse Products</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
                      <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{formatPriceShort(item.price)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => updateCartQty(item.id, item.quantity - 1)} style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14 }}>-</button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, item.quantity + 1)} style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{formatPriceShort(cartTotal)}</span>
                  </div>
                  <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '12px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <HiHeart size={22} style={{ color: '#f43f5e' }} /> Wishlist ({wishlist.length})
            </h2>
            <div className="products-grid">
              {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width:768px) {
          .dashboard-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
