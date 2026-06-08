import React, { useState } from 'react';
import QRGeneratorComponent from '../../components/QRGenerator';
import { PRODUCTS } from '../../utils/constants';

const QRGeneratorPage = () => {
  const [input, setInput] = useState('');
  const [type, setType]   = useState('url');
  const [selected, setSelected] = useState(null);

  const TYPES = [
    { id: 'url',     label: '🔗 Custom URL' },
    { id: 'product', label: '📦 Product Page' },
    { id: 'text',    label: '📝 Custom Text' },
  ];

  const qrData = type === 'product' && selected
    ? `${window.location.origin}/products/${selected}`
    : input;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 40, paddingBottom: 60 }}>
      <div className="container-xs">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ display: 'inline-block', fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📲</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>QR Code Generator</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Generate QR codes for products or custom links</p>
        </div>

        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg-card)', padding: 6, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          {TYPES.map(t => (
            <button key={t.id} onClick={() => { setType(t.id); setInput(''); setSelected(null); }} style={{
              flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: type === t.id ? 'var(--gradient-primary)' : 'transparent',
              color: type === t.id ? '#fff' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 24 }}>
          {type === 'product' ? (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>Select Product</label>
              <select
                value={selected || ''}
                onChange={(e) => setSelected(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 15, outline: 'none', cursor: 'pointer' }}
              >
                <option value="">-- Choose a product --</option>
                {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>
                {type === 'url' ? 'Enter URL' : 'Enter Text'}
              </label>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={type === 'url' ? 'https://example.com' : 'Enter any text…'}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 15, outline: 'none' }}
              />
            </div>
          )}
        </div>

        {/* QR Output */}
        {qrData && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRGeneratorComponent data={qrData} size={220} label={type === 'product' ? `QR for product #${selected}` : 'Your QR Code'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGeneratorPage;
