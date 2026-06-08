import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiShoppingCart, HiHeart, HiStar, HiCheck, HiShare } from 'react-icons/hi';
import { getProductById, PRODUCTS } from '../../utils/constants';
import { formatPriceShort, calcDiscount, getStockStatus } from '../../utils/helpers';
import { useAuthContext } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, toggleWishlist, isInWishlist, isInCart, isAuthenticated } = useAuthContext();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  if (!product) return (
    <div className="empty-state" style={{ minHeight: '100vh' }}>
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">Product not found</h3>
      <button onClick={() => navigate('/products')} style={{ padding: '10px 24px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
        Back to Products
      </button>
    </div>
  );

  const { name, brand, image, price, originalPrice, rating, reviews, stock, description, specs, colors, tags, category, isNew } = product;
  const discount   = calcDiscount(originalPrice, price);
  const stockInfo  = getStockStatus(stock);
  const inWishlist = isInWishlist(product.id);
  const inCart     = isInCart(product.id);

  const related = PRODUCTS.filter(p => p.category === category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login');
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return navigate('/login');
    addToCart(product, qty);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 60 }}>
      <div className="container" style={{ paddingTop: 32 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <button onClick={() => navigate(-1)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            padding: '8px 16px', borderRadius: 8,
          }}>
            <HiArrowLeft size={16} /> Back
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/ {category} / {name}</span>
        </div>

        {/* Main Product */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }} className="product-detail-grid">
          {/* Image Panel */}
          <div>
            <div style={{
              background: 'linear-gradient(145deg,var(--bg-card),var(--bg-secondary))',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)',
              padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 400, position: 'relative', overflow: 'hidden',
            }}>
              {isNew && (
                <span style={{
                  position: 'absolute', top: 20, left: 20,
                  background: 'var(--gradient-accent)', color: '#fff',
                  fontSize: 11, fontWeight: 800, padding: '6px 14px',
                  borderRadius: 'var(--radius-full)', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>NEW</span>
              )}
              {discount > 0 && (
                <span style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'var(--success-light)', color: 'var(--success)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  fontSize: 13, fontWeight: 800, padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                }}>-{discount}%</span>
              )}
              <img src={image} alt={name} style={{
                maxHeight: 320, maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                animation: 'float 4s ease-in-out infinite',
              }} />
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {tags?.map(tag => (
                <span key={tag} style={{
                  padding: '5px 14px', background: 'var(--primary-light)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600,
                  color: 'var(--primary)',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {brand}
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', fontWeight: 800, marginTop: 8, lineHeight: 1.2 }}>{name}</h1>
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar key={i} size={18} style={{ color: i < Math.round(rating) ? '#f59e0b' : 'var(--border)' }} />
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{rating}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>
                {formatPriceShort(price)}
              </span>
              {originalPrice > price && (
                <>
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatPriceShort(originalPrice)}
                  </span>
                  <span style={{ padding: '4px 12px', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                    Save {formatPriceShort(originalPrice - price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: stockInfo.color }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: stockInfo.color }}>{stockInfo.label}</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{description}</p>

            {/* Colors */}
            {colors?.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Available Colors</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {colors.map(c => (
                    <span key={c} style={{ padding: '6px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 40, background: 'var(--bg-elevated)', border: 'none', color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer', borderRight: '1px solid var(--border)' }}>-</button>
                <span style={{ width: 48, textAlign: 'center', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', height: 40, lineHeight: '40px', display: 'block' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(stock, qty + 1))} style={{ width: 40, height: 40, background: 'var(--bg-elevated)', border: 'none', color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer', borderLeft: '1px solid var(--border)' }}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleAddToCart} disabled={stock === 0} style={{
                flex: 1, minWidth: 140, padding: '14px 24px',
                background: inCart ? 'var(--success-light)' : 'var(--gradient-primary)',
                color: inCart ? 'var(--success)' : '#fff',
                border: inCart ? '1px solid rgba(16,185,129,0.3)' : 'none',
                borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: stock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.25s ease',
              }}>
                <HiShoppingCart size={18} />
                {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={stock === 0} style={{
                flex: 1, minWidth: 140, padding: '14px 24px',
                background: 'var(--gradient-accent)', color: '#fff',
                border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: stock === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
              }}>
                ⚡ Buy Now
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { if (!isAuthenticated) return navigate('/login'); toggleWishlist(product); }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: inWishlist ? 'rgba(244,63,94,0.1)' : 'var(--bg-card)',
                border: `1px solid ${inWishlist ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`,
                color: inWishlist ? '#f43f5e' : 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <HiHeart size={16} /> {inWishlist ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button onClick={handleShare} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <HiShare size={16} /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              {[
                { icon: '🛡️', text: 'Genuine Product' },
                { icon: '🚚', text: 'Free Delivery' },
                { icon: '🔄', text: '30-Day Return' },
                { icon: '💳', text: 'Secure Payment' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', borderRadius: 10,
                }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specs / Reviews */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', marginBottom: 60 }}>
          <div className="tabs" style={{ padding: '0 24px', margin: 0 }}>
            {[
              { id: 'specs',   label: '📋 Specifications' },
              { id: 'reviews', label: '⭐ Reviews' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 32 }}>
            {activeTab === 'specs' && specs && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="specs-grid">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} style={{
                    padding: '16px 20px', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)', borderRadius: 12,
                  }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{key}</p>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{val}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Rating Summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '24px', background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{rating}</div>
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 8 }}>
                      {Array.from({ length: 5 }).map((_, i) => <HiStar key={i} size={16} style={{ color: i < Math.round(rating) ? '#f59e0b' : 'var(--border)' }} />)}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{reviews.toLocaleString()} reviews</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                      return (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 12 }}>{star}</span>
                          <HiStar size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                          <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 28 }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mock Reviews */}
                {[
                  { name: 'Arjun K.', rating: 5, date: '1 week ago', text: 'Absolutely outstanding product. Exceeded all expectations. The build quality is premium and performance is top-notch.' },
                  { name: 'Priya M.', rating: 4, date: '2 weeks ago', text: 'Very happy with the purchase. Fast delivery and genuine product. Would definitely recommend to friends and family.' },
                  { name: 'Rohan S.', rating: 5, date: '1 month ago', text: 'Best purchase I\'ve made this year! Worth every rupee. TechVault\'s service is also excellent.' },
                ].map((review, i) => (
                  <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{review.name}</p>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {Array.from({ length: 5 }).map((_, j) => <HiStar key={j} size={12} style={{ color: j < review.rating ? '#f59e0b' : 'var(--border)' }} />)}
                        </div>
                      </div>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{review.date}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 52 }}>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>You might also like</h2>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width:768px) {
          .product-detail-grid { grid-template-columns:1fr !important; }
          .specs-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
