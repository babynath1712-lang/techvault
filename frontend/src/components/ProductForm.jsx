import React, { useState } from 'react';
import { CATEGORIES, BRANDS, PRICE_RANGES } from '../utils/constants';
import Button from './ui/Button';
import { HiFilter } from 'react-icons/hi';

const ProductForm = ({
  category, setCategory,
  priceRange, setPriceRange,
  selectedBrands, toggleBrand,
  resetFilters,
  totalCount,
}) => {
  return (
    <aside style={{
      width: '100%',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: 24,
      position: 'sticky', top: 'calc(var(--nav-height) + 16px)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
          <HiFilter size={18} style={{ color: 'var(--primary)' }} />
          Filters
        </div>
        <button onClick={resetFilters} style={{
          fontSize: 12, color: 'var(--primary)', cursor: 'pointer', fontWeight: 600,
          background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 6,
        }}>
          Reset
        </button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Category</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              background: category === cat.id ? 'var(--primary-light)' : 'transparent',
              border: `1px solid ${category === cat.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
              color: category === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: category === cat.id ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
            }}>
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Price Range</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PRICE_RANGES.map((range, i) => {
            const active = priceRange?.label === range.label;
            return (
              <button key={i} onClick={() => setPriceRange(active ? null : range)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                background: active ? 'var(--primary-light)' : 'transparent',
                border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  background: active ? 'var(--primary)' : 'transparent',
                  flexShrink: 0,
                }} />
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div style={{ marginBottom: 16 }}>
        <p style={sectionLabel}>Brands</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BRANDS.map(brand => {
            const active = selectedBrands.includes(brand);
            return (
              <button key={brand} onClick={() => toggleBrand(brand)} style={{
                padding: '5px 12px', borderRadius: 20,
                background: active ? 'var(--primary-light)' : 'var(--bg-secondary)',
                border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 20, padding: '12px', background: 'var(--primary-light)', borderRadius: 10, textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
          {totalCount} products found
        </span>
      </div>
    </aside>
  );
};

const sectionLabel = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
};

export default ProductForm;
