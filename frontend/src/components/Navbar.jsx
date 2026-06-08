import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiSearch, HiShoppingCart, HiHeart, HiMenu, HiX,
  HiUser, HiLogout, HiViewGrid, HiCog,
} from 'react-icons/hi';
import { useAuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { formatPriceShort } from '../utils/helpers';

const CATEGORIES_NAV = [
  { label: 'Mobiles',      path: '/products?cat=mobiles' },
  { label: 'Laptops',      path: '/products?cat=laptops' },
  { label: 'Tablets',      path: '/products?cat=tablets' },
  { label: 'Headphones',   path: '/products?cat=headphones' },
  { label: 'Earbuds',      path: '/products?cat=earbuds' },
  { label: 'Smartwatches', path: '/products?cat=smartwatches' },
];

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, cart, cartCount, logout } = useAuthContext();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate   = useNavigate();
  const location   = useLocation();
  const profileRef = useRef(null);
  const cartRef    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-height)',
        background: scrolled ? 'rgba(6,6,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          height: '100%', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}>⚡</div>
            <span style={{
              fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>TechVault</span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}
            className="desktop-nav">
            {CATEGORIES_NAV.map(({ label, path }) => (
              <Link key={label} to={path} style={{
                padding: '6px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--primary-light)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
              >{label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  style={{
                    width: 220, padding: '8px 14px',
                    background: 'var(--bg-card)', border: '1px solid var(--primary)',
                    borderRadius: 8, color: 'var(--text-primary)', fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <HiX size={20} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} style={iconBtnStyle}>
                <HiSearch size={20} />
              </button>
            )}

            {/* Wishlist */}
            <Link to="/dashboard" style={iconBtnStyle}>
              <HiHeart size={20} />
            </Link>

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* Cart */}
            <div ref={cartRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                style={{ ...iconBtnStyle, position: 'relative' }}
              >
                <HiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: 'var(--primary)', color: '#fff',
                    fontSize: 10, fontWeight: 700,
                    width: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-primary)',
                  }}>{cartCount > 9 ? '9+' : cartCount}</span>
                )}
              </button>
              {cartOpen && (
                <div style={dropdownStyle({ width: 320, right: 0 })}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700 }}>Cart ({cartCount} items)</h4>
                  </div>
                  {cart.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
                      Your cart is empty
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: 280, overflowY: 'auto', padding: '8px 0' }}>
                        {cart.map(item => (
                          <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 20px',
                          }}>
                            <img src={item.image} alt={item.name}
                              style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, background: 'var(--bg-secondary)' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                {formatPriceShort(item.price)} × {item.quantity}
                              </p>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                              {formatPriceShort(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
                        <button onClick={() => { navigate('/checkout'); setCartOpen(false); }}
                          style={{
                            width: '100%', padding: '12px',
                            background: 'var(--gradient-primary)',
                            color: '#fff', border: 'none', borderRadius: 10,
                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          }}>
                          Checkout →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            {isAuthenticated ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px 6px 6px',
                  background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 'var(--radius-full)', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff',
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
                {profileOpen && (
                  <div style={dropdownStyle({ width: 200, right: 0 })}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    {[
                      { icon: <HiUser />, label: 'Profile', path: '/profile' },
                      { icon: <HiViewGrid />, label: 'Dashboard', path: '/dashboard' },
                      ...(isAdmin ? [{ icon: <HiCog />, label: 'Admin Panel', path: '/admin' }] : []),
                    ].map(({ icon, label, path }) => (
                      <Link key={label} to={path} style={menuItemStyle} onClick={() => setProfileOpen(false)}>
                        <span style={{ fontSize: 16 }}>{icon}</span>
                        {label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }}>
                      <button onClick={logout} style={{ ...menuItemStyle, width: '100%', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <HiLogout size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={ghostBtnStyle}>Login</Link>
                <Link to="/signup" style={primaryBtnStyle}>Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ ...iconBtnStyle, display: 'none' }} className="mobile-menu-btn">
              {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            position: 'absolute', top: 'var(--nav-height)', left: 0, right: 0,
            background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
            padding: '16px 24px 24px',
            animation: 'fadeInDown 0.3s ease',
          }} onClick={(e) => e.stopPropagation()}>
            {CATEGORIES_NAV.map(({ label, path }) => (
              <Link key={label} to={path} style={{
                display: 'block', padding: '12px 0',
                fontSize: 16, fontWeight: 500, color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-light)',
              }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-menu-btn { display:flex !important; }
        }
      `}</style>
    </>
  );
};

const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 40, height: 40, borderRadius: 10,
  background: 'transparent', border: '1px solid var(--border)',
  color: 'var(--text-secondary)', cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const dropdownStyle = ({ width, right }) => ({
  position: 'absolute', top: 'calc(100% + 10px)', right,
  width, background: 'var(--bg-elevated)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.2s ease', zIndex: 100,
  overflow: 'hidden',
});

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 16px', fontSize: 14, fontWeight: 500,
  color: 'var(--text-secondary)', cursor: 'pointer',
  transition: 'all 0.15s ease', textDecoration: 'none', background: 'none', border: 'none', width: '100%',
};

const ghostBtnStyle = {
  padding: '8px 16px', borderRadius: 8,
  border: '1px solid var(--border)', color: 'var(--text-secondary)',
  fontSize: 14, fontWeight: 500, cursor: 'pointer', textDecoration: 'none',
};

const primaryBtnStyle = {
  padding: '8px 18px', borderRadius: 8,
  background: 'var(--gradient-primary)', color: '#fff',
  fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
};

export default Navbar;
