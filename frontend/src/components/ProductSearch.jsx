import React, { useState } from 'react';
import { HiSearch, HiX, HiAdjustments } from 'react-icons/hi';

const ProductSearch = ({ value, onChange, onClear, placeholder = 'Search products, brands…' }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-card)',
        border: `1px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.2s ease',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
        overflow: 'hidden',
      }}>
        <span style={{
          padding: '0 16px', color: focused ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: 18, display: 'flex', alignItems: 'center', flexShrink: 0,
          transition: 'color 0.2s ease',
        }}>
          <HiSearch />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1, padding: '14px 0',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: 15,
          }}
        />
        {value && (
          <button onClick={onClear} style={{
            padding: '0 16px', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', fontSize: 18,
            transition: 'color 0.15s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <HiX />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
