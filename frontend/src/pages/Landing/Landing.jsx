import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiArrowRight, HiStar, HiShoppingCart, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { HERO_SLIDES, CATEGORIES, PRODUCTS, STATS, getFeaturedProducts } from '../../utils/constants';
import { formatPriceShort, calcDiscount } from '../../utils/helpers';
import ProductCard from '../../components/ProductCard';

const Landing = () => {
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const featured = getFeaturedProducts().slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => changeSlide(1), 5000);
    return () => clearInterval(timer);
  }, [heroIdx]);

  const changeSlide = (dir) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setHeroIdx(i => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  };

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 70% 80% at 60% 40%, ${slide.color}25 0%, transparent 60%), var(--bg-primary)`,
          transition: 'background 0.8s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Floating Orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${slide.color}15 0%, transparent 70%)`, top: '10%', right: '-100px', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', bottom: '20%', left: '-50px', animation: 'float 4s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            alignItems: 'center', gap: 60, minHeight: '80vh',
          }} className="hero-grid">

            {/* Left Content */}
            <div style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: `${slide.color}18`, border: `1px solid ${slide.color}35`, borderRadius: 'var(--radius-full)', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: slide.color, boxShadow: `0 0 8px ${slide.color}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: slide.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {slide.subtitle}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(3rem,5vw,5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}>
                <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {slide.title}
                </span>
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, maxWidth: 480 }}>
                {slide.desc}
              </p>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 36, fontFamily: "'Space Grotesk',sans-serif" }}>
                Starting at {slide.price}
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button onClick={() => navigate(`/products/${slide.productId}`)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px',
                  background: 'var(--gradient-primary)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-strong)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
                >
                  Shop Now <HiArrowRight />
                </button>
                <button onClick={() => navigate('/products')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px',
                  background: 'transparent',
                  color: 'var(--text-primary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  View All
                </button>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', gap: 28, marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                width: '100%', maxWidth: 480,
                aspectRatio: '1',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Ring */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  border: `1px solid ${slide.color}25`,
                  animation: 'border-glow 3s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: '10%',
                  borderRadius: '50%',
                  border: `1px solid ${slide.color}15`,
                }} />

                {/* Product Image */}
                <img
                  key={heroIdx}
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    maxHeight: 360, maxWidth: '80%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                    animation: 'float 4s ease-in-out infinite, scaleIn 0.5s ease',
                    position: 'relative', zIndex: 2,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Slide Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 32, position: 'relative', zIndex: 2 }}>
            <button onClick={() => changeSlide(-1)} style={slideBtn}>
              <HiChevronLeft size={20} />
            </button>
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} style={{
                width: i === heroIdx ? 32 : 8, height: 8,
                borderRadius: 4,
                background: i === heroIdx ? 'var(--primary)' : 'var(--border)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease',
              }} />
            ))}
            <button onClick={() => changeSlide(1)} style={slideBtn}>
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">🗂️ Browse by Category</span>
            <h2 className="section-title">Shop by <span className="text-gradient">Category</span></h2>
            <p className="section-subtitle">Explore our curated collection of premium tech products</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
              const count = PRODUCTS.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?cat=${cat.id}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                    padding: '28px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = cat.color + '50';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3),0 0 20px ${cat.color}20`;
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: cat.color + '18',
                    border: `1px solid ${cat.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    transition: 'transform 0.3s ease',
                  }}>
                    {cat.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{cat.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} product{count !== 1 ? 's' : ''}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">⭐ Handpicked for You</span>
            <h2 className="section-title">Featured <span className="text-gradient">Products</span></h2>
            <p className="section-subtitle">Our top picks from the best brands in the industry</p>
          </div>
          <div className="products-grid">
            {featured.map(product => (
              <div key={product.id} style={{ animation: `fadeInUp 0.5s ease ${product.id * 0.05}s both` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={() => navigate('/products')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 40px',
              background: 'transparent',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--primary)', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
            >
              View All 23 Products <HiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">💡 Why TechVault</span>
            <h2 className="section-title">The Premium <span className="text-gradient">Difference</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { emoji: '🔒', title: 'Secure Payments', desc: 'Razorpay-powered secure checkout with multiple payment options.', color: '#6366f1' },
              { emoji: '🚚', title: 'Fast Delivery', desc: 'Pan-India delivery in 2-5 business days. Express available.', color: '#06b6d4' },
              { emoji: '✅', title: 'Genuine Products', desc: '100% authentic products with manufacturer warranty.', color: '#10b981' },
              { emoji: '🔄', title: 'Easy Returns', desc: '30-day hassle-free returns and exchange policy.', color: '#8b5cf6' },
              { emoji: '📱', title: 'QR Tracking', desc: 'Scan QR codes to track your orders in real-time.', color: '#f59e0b' },
              { emoji: '🎧', title: '24/7 Support', desc: 'Round-the-clock customer support for all your queries.', color: '#f43f5e' },
            ].map(({ emoji, title, desc, color }) => (
              <div key={title} style={{
                padding: 28,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3),0 0 20px ${color}15`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{
            position: 'relative', overflow: 'hidden',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-2xl)',
            padding: '60px 48px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-glow-strong)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Ready to upgrade your tech?
              </h2>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                Join 50,000+ customers who trust TechVault for premium products.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/signup')} style={{
                  padding: '14px 36px',
                  background: '#fff', color: 'var(--primary)',
                  border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Get Started Free
                </button>
                <button onClick={() => navigate('/products')} style={{
                  padding: '14px 36px',
                  background: 'transparent', color: '#fff',
                  border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12,
                  fontSize: 16, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width:768px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-grid > div:last-child { display:none; }
        }
      `}</style>
    </div>
  );
};

const slideBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: '50%',
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  color: 'var(--text-secondary)', cursor: 'pointer',
};

export default Landing;
