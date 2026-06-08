import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiAdjustments, HiX } from 'react-icons/hi';
import { SORT_OPTIONS } from '../../utils/constants';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import ProductSearch from '../../components/ProductSearch';
import ProductForm from '../../components/ProductForm';
import Loader, { SkeletonCard } from '../../components/ui/Loader';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    filteredProducts,
    search, setSearch,
    category, setCategory,
    sort, setSort,
    priceRange, setPriceRange,
    selectedBrands, toggleBrand,
    resetFilters,
    totalCount,
  } = useProducts();

  // Apply URL params — re-run whenever URL changes (e.g. navbar category clicks)
  useEffect(() => {
    const cat = searchParams.get('cat');
    const q   = searchParams.get('q');
    if (cat) setCategory(cat);
    else setCategory('all');
    if (q) setSearch(q);
    else setSearch('');
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 32 }}>
      <div className="container" style={{ paddingBottom: 60 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: '10px 16px', background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {/* Mobile Filter Button */}
              <button onClick={() => setFilterOpen(true)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px',
                background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 10, color: 'var(--primary)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }} className="mobile-filter-btn">
                <HiAdjustments size={18} /> Filters
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginTop: 20 }}>
            <ProductSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
          </div>

          {/* Active Filters */}
          {(category !== 'all' || priceRange || selectedBrands.length > 0 || search) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 4, alignSelf: 'center' }}>Active:</span>
              {category !== 'all' && <Chip label={`Category: ${category}`} onRemove={() => setCategory('all')} />}
              {priceRange && <Chip label={priceRange.label} onRemove={() => setPriceRange(null)} />}
              {selectedBrands.map(b => <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />)}
              {search && <Chip label={`"${search}"`} onRemove={() => setSearch('')} />}
              <button onClick={resetFilters} style={{ fontSize: 12, color: 'var(--error)', background: 'var(--error-light)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '4px 12px', cursor: 'pointer' }}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }} className="products-layout">
          {/* Sidebar */}
          <div className="filter-sidebar">
            <ProductForm
              category={category} setCategory={setCategory}
              priceRange={priceRange} setPriceRange={setPriceRange}
              selectedBrands={selectedBrands} toggleBrand={toggleBrand}
              resetFilters={resetFilters} totalCount={totalCount}
            />
          </div>

          {/* Products */}
          <div>
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">No products found</h3>
                <p className="empty-state-text">Try adjusting your filters or search query</p>
                <button onClick={resetFilters} style={{
                  padding: '10px 24px', background: 'var(--primary-light)',
                  border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10,
                  color: 'var(--primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((p, i) => (
                  <div key={p.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setFilterOpen(false)}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 300, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', overflowY: 'auto', animation: 'fadeInRight 0.3s ease' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Filters</h3>
              <button onClick={() => setFilterOpen(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}><HiX size={20} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <ProductForm
                category={category} setCategory={setCategory}
                priceRange={priceRange} setPriceRange={setPriceRange}
                selectedBrands={selectedBrands} toggleBrand={toggleBrand}
                resetFilters={resetFilters} totalCount={totalCount}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:900px) {
          .products-layout { grid-template-columns:1fr !important; }
          .filter-sidebar { display:none; }
          .mobile-filter-btn { display:flex !important; }
        }
        @media (min-width:901px) {
          .mobile-filter-btn { display:none !important; }
        }
      `}</style>
    </div>
  );
};

const Chip = ({ label, onRemove }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px 4px 12px',
    background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 20, fontSize: 12, color: 'var(--primary)', fontWeight: 500,
  }}>
    {label}
    <button onClick={onRemove} style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <HiX size={12} />
    </button>
  </div>
);

export default Products;
