import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiShoppingCart, HiStar } from 'react-icons/hi';
import { useAuthContext } from '../context/AuthContext';
import { formatPriceShort, calcDiscount, getStockStatus } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, isInCart, isAuthenticated } = useAuthContext();
  const { id, name, brand, image, price, originalPrice, rating, reviews, stock, isNew, category } = product;

  const discount   = calcDiscount(originalPrice, price);
  const stockInfo  = getStockStatus(stock);
  const inWishlist = isInWishlist(id);
  const inCart     = isInCart(id);

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    addToCart(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => navigate(`/products/${id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4),0 0 30px rgba(99,102,241,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {isNew && (
          <span style={{
            background: 'var(--gradient-accent)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 10px',
            borderRadius: 'var(--radius-full)', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>NEW</span>
        )}
        {discount > 0 && (
          <span style={{
            background: 'var(--success-light)', color: 'var(--success)',
            border: '1px solid rgba(16,185,129,0.25)',
            fontSize: 10, fontWeight: 700, padding: '3px 10px',
            borderRadius: 'var(--radius-full)', letterSpacing: '0.04em',
          }}>-{discount}%</span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          width: 34, height: 34, borderRadius: '50%',
          background: inWishlist ? 'rgba(244,63,94,0.15)' : 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${inWishlist ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease',
          color: inWishlist ? '#f43f5e' : 'rgba(255,255,255,0.6)',
        }}
      >
        <HiHeart size={16} />
      </button>

      {/* Image */}
      <div style={{
        height: 200, background: 'linear-gradient(145deg,var(--bg-secondary),var(--bg-card))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, overflow: 'hidden',
      }}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          style={{
            maxHeight: 160, maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--primary)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>{brand}</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
          lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{name}</h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', color: '#f59e0b', fontSize: 12, gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i < Math.round(rating) ? 1 : 0.3 }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {rating} ({reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>
            {formatPriceShort(price)}
          </span>
          {originalPrice > price && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {formatPriceShort(originalPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <span style={{ fontSize: 11, color: stockInfo.color, fontWeight: 600 }}>
          {stockInfo.label}
        </span>

        {/* Add to Cart */}
        <button
          onClick={handleCartClick}
          disabled={stock === 0}
          style={{
            marginTop: 4,
            padding: '10px 0', width: '100%',
            background: inCart ? 'var(--success-light)' : 'var(--gradient-primary)',
            color: inCart ? 'var(--success)' : '#fff',
            border: inCart ? '1px solid rgba(16,185,129,0.3)' : 'none',
            borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: stock === 0 ? 'not-allowed' : 'pointer',
            opacity: stock === 0 ? 0.5 : 1,
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <HiShoppingCart size={15} />
          {stock === 0 ? 'Out of Stock' : inCart ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
