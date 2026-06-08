import React, { useState, useEffect } from 'react';
import { HiDownload, HiRefresh } from 'react-icons/hi';

const QRGenerator = ({ data, size = 200, label }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setLoading(true);
    const encoded = encodeURIComponent(data);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=111122&color=a5b4fc&margin=10`;
    setQrUrl(url);
    setLoading(false);
  }, [data, size]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      padding: 24,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
    }}>
      {label && <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</p>}
      <div style={{
        width: size + 24, height: size + 24,
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--border)',
      }}>
        {loading ? (
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }} />
        ) : qrUrl ? (
          <img src={qrUrl} alt="QR Code" style={{ borderRadius: 8 }} />
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data</p>
        )}
      </div>
      {qrUrl && (
        <button onClick={handleDownload} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 20px',
          background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}>
          <HiDownload size={16} /> Download QR
        </button>
      )}
    </div>
  );
};

export default QRGenerator;
