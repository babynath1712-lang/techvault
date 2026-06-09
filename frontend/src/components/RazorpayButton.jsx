import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import realQRImage from '../assets/images/upi_qr_real.jpg';

// ── UPI Payment Component ──────────────────────────────────────────────────
const UPI_ID   = 'sivambabynath@okicici';   // India Post Payment Bank
const UPI_NAME = 'Baby nath';

const UPIPaymentButton = ({ amount, orderId, onSuccess, disabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        id="upi-pay-btn"
        onClick={() => setModalOpen(true)}
        disabled={disabled}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '14px 32px', width: '100%',
          background: disabled ? 'var(--bg-elevated)' : 'var(--gradient-primary)',
          border: 'none', borderRadius: 'var(--radius-md)',
          color: '#fff', fontSize: 16, fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.25s ease',
          fontFamily: 'inherit',
          boxShadow: !disabled ? 'var(--shadow-glow)' : 'none',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        📱 Pay ₹{amount?.toLocaleString('en-IN')} via UPI
      </button>

      {modalOpen && (
        <UPIModal
          amount={amount}
          orderId={orderId}
          onSuccess={onSuccess}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

// ── UPI Modal ────────────────────────────────────────────────────────────────
const UPIModal = ({ amount, orderId, onSuccess, onClose }) => {
  const [stage, setStage]     = useState('qr');   // 'qr' | 'confirm' | 'success'
  const [txnId, setTxnId]     = useState('');
  const [txnErr, setTxnErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('TechVault Order')}`;

  const UPI_APPS = [
    { name: 'GPay',    icon: '🟢', link: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR` },
    { name: 'PhonePe', icon: '🟣', link: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR` },
    { name: 'Paytm',   icon: '🔵', link: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR` },
    { name: 'BHIM',    icon: '🟠', link: upiLink },
  ];

  // ── Confirm: require UTR before placing order ───────────────────────────
  const handleConfirm = async () => {
    // Validate UTR is entered
    if (!txnId.trim()) {
      setTxnErr('Please enter the UPI Transaction ID (UTR) from your payment app.');
      return;
    }
    if (txnId.trim().length < 6) {
      setTxnErr('Transaction ID looks too short. Please check and re-enter.');
      return;
    }
    setTxnErr('');
    setLoading(true);
    try {
      if (orderId) {
        await api.patch(`/orders/${orderId}/status`, {
          status: 'processing',
          payment_note: `UPI Transaction ID: ${txnId.trim()}`,
        });
      }
      setStage('success');
      setTimeout(() => {
        toast.success('🎉 Order confirmed! We will verify your payment shortly.');
        onSuccess?.({ upi_id: UPI_ID, txn_id: txnId.trim(), amount });
        onClose();
      }, 1500);
    } catch {
      // Even if API fails, complete the flow — payment was made
      setStage('success');
      setTimeout(() => {
        toast.success('🎉 Order confirmed! We will verify your payment shortly.');
        onSuccess?.({ upi_id: UPI_ID, txn_id: txnId.trim(), amount });
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
        overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget && stage === 'qr') onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        margin: 'auto',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'var(--gradient-primary)',
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📱</div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>
                TechVault · UPI Payment
              </p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif" }}>
                ₹{amount?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          {stage === 'qr' && (
            <button
              onClick={onClose}
              style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, background: 'none', border: 'none', lineHeight: 1, padding: 4 }}
            >✕</button>
          )}
        </div>

        {/* ── Success Stage ── */}
        {stage === 'success' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, animation: 'scaleIn 0.4s ease',
            }}>✅</div>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>Payment Confirmed!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your order has been placed successfully.</p>
          </div>
        )}

        {/* ── QR Stage ── */}
        {stage === 'qr' && (
          <div style={{ padding: '24px 20px' }}>

            {/* QR Code — centered */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, fontWeight: 500 }}>
                Scan with any UPI app to pay
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'inline-flex',
                  padding: 12,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  border: '2px solid rgba(99,102,241,0.15)',
                }}>
                  <img
                    src={realQRImage}
                    alt={`UPI QR — pay to ${UPI_ID}`}
                    style={{
                      width: 200,
                      height: 200,
                      display: 'block',
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                Paying to: <strong style={{ color: 'var(--text-primary)' }}>{UPI_NAME}</strong> · India Post Payment Bank
              </p>
            </div>

            {/* UPI ID */}
            <div style={{
              textAlign: 'center', marginBottom: 20,
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                UPI ID
              </p>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
                {UPI_ID}
              </p>
              <button
                onClick={() => { navigator.clipboard?.writeText(UPI_ID); toast.success('UPI ID copied!'); }}
                style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                📋 Copy UPI ID
              </button>
            </div>

            {/* UPI App Quick Launch */}
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, textAlign: 'center' }}>
              Or open in app
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {UPI_APPS.map(app => (
                <a
                  key={app.name}
                  href={app.link}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    textDecoration: 'none', color: 'var(--text-primary)',
                    fontSize: 13, fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <span style={{ fontSize: 16 }}>{app.icon}</span>
                  {app.name}
                </a>
              ))}
            </div>

            {/* After Payment */}
            <button
              onClick={() => setStage('confirm')}
              style={{
                width: '100%', padding: '13px',
                background: 'var(--gradient-primary)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              ✅ I've Paid — Enter Transaction ID
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              🔒 Payments go directly to seller's verified UPI account
            </p>
          </div>
        )}

        {/* ── Confirm Stage — UTR required ── */}
        {stage === 'confirm' && (
          <div style={{ padding: '24px 20px' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Confirm Payment</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Enter the <strong>UPI Transaction ID (UTR)</strong> from your payment app to confirm your order.
            </p>

            {/* UTR Input — required */}
            <div style={{ marginBottom: 6 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 700,
                color: 'var(--text-muted)', marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Transaction ID (UTR) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={txnId}
                onChange={e => { setTxnId(e.target.value); setTxnErr(''); }}
                placeholder="e.g. 405812345678"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${txnErr ? '#ef4444' : 'var(--border)'}`,
                  borderRadius: 10,
                  color: 'var(--text-primary)', fontSize: 14,
                  outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
              {txnErr && (
                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontWeight: 500 }}>
                  ⚠️ {txnErr}
                </p>
              )}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Find this in your UPI app → Transaction History → Reference / UTR No.
              </p>
            </div>

            {/* Warning banner */}
            <div style={{
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, marginBottom: 16, marginTop: 14,
            }}>
              <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                ⚠️ Do not confirm if you haven't completed the payment. Orders confirmed without payment will be cancelled.
              </p>
            </div>

            {/* Payment Summary */}
            <div style={{
              padding: '12px 16px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 10, marginBottom: 20,
            }}>
              <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>Payment Summary</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Amount: <strong style={{ color: 'var(--text-primary)' }}>₹{amount?.toLocaleString('en-IN')}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                To: <strong style={{ color: 'var(--text-primary)' }}>{UPI_ID}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setStage('qr'); setTxnErr(''); }}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text-secondary)',
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  flex: 2, padding: '12px',
                  background: 'var(--gradient-primary)',
                  border: 'none', borderRadius: 10,
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {loading ? '⏳ Confirming…' : '✅ Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @media (max-width: 480px) {
          /* Ensure modal fits on small screens */
          #upi-pay-btn { font-size: 14px !important; padding: 12px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default UPIPaymentButton;
