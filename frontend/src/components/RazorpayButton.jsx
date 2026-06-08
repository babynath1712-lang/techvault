import React, { useState } from 'react';
import toast from 'react-hot-toast';

// ── Mock payment modal — works without Razorpay key or backend ──────────────

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI',          icon: '📱', desc: 'Pay via Google Pay, PhonePe, Paytm' },
  { id: 'card',    label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbank', label: 'Net Banking',   icon: '🏦', desc: 'All major banks supported' },
  { id: 'wallet',  label: 'Wallets',       icon: '👛', desc: 'Paytm, PhonePe, Amazon Pay' },
];

const MockPaymentModal = ({ amount, orderId, onSuccess, onClose }) => {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId]   = useState('');
  const [card, setCard]     = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [bank, setBank]     = useState('');
  const [processing, setProcessing] = useState(false);
  const [stage, setStage]   = useState('form'); // 'form' | 'processing' | 'success'

  const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'];

  const handlePay = async () => {
    // Basic validation
    if (method === 'upi' && !upiId.includes('@')) {
      toast.error('Enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length < 16) { toast.error('Enter a valid 16-digit card number'); return; }
      if (!card.expiry || !card.cvv || !card.name) { toast.error('Fill all card details'); return; }
    }
    if (method === 'netbank' && !bank) { toast.error('Select a bank'); return; }

    setStage('processing');
    setProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2200));

    setStage('success');
    await new Promise(r => setTimeout(r, 1200));

    const mockResponse = {
      razorpay_payment_id: `pay_mock_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      razorpay_order_id: orderId,
      razorpay_signature: 'mock_signature',
      method,
      amount,
    };

    toast.success('🎉 Payment successful!');
    onSuccess?.(mockResponse);
    onClose();
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && stage === 'form') onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'var(--gradient-primary)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>TechVault Secure Checkout</p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif" }}>
                ₹{amount?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          {stage === 'form' && (
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, lineHeight: 1, background: 'none', border: 'none' }}>✕</button>
          )}
        </div>

        {/* ── Processing / Success State ── */}
        {stage === 'processing' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 20px',
              borderRadius: '50%',
              border: '4px solid var(--border)',
              borderTop: '4px solid var(--primary)',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Processing Payment…</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Please do not close this window</p>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--primary)',
                  animation: `bounce 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
              animation: 'scaleIn 0.4s ease',
            }}>✅</div>
            <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--success)' }}>Payment Successful!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Redirecting to order confirmation…</p>
          </div>
        )}

        {/* ── Payment Form ── */}
        {stage === 'form' && (
          <div style={{ padding: 24 }}>

            {/* Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  padding: '10px 12px',
                  background: method === m.id ? 'var(--primary-light)' : 'var(--bg-card)',
                  border: `1.5px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 10, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: method === m.id ? 'var(--primary)' : 'var(--text-primary)' }}>{m.label}</div>
                </button>
              ))}
            </div>

            {/* UPI Form */}
            {method === 'upi' && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>UPI ID</label>
                <input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  style={inputStyle}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {['GPay', 'PhonePe', 'Paytm'].map(app => (
                    <button key={app} onClick={() => setUpiId(`demo@${app.toLowerCase()}`)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}>{app}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Form */}
            {method === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Card Number</label>
                  <input
                    value={card.number}
                    onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input
                      value={card.expiry}
                      onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input
                      value={card.cvv}
                      onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                      placeholder="•••"
                      type="password"
                      maxLength={3}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Cardholder Name</label>
                  <input
                    value={card.name}
                    onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                    placeholder="As on card"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'netbank' && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Select Bank</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {BANKS.map(b => (
                    <button key={b} onClick={() => setBank(b)} style={{
                      padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                      background: bank === b ? 'var(--primary-light)' : 'var(--bg-card)',
                      border: `1.5px solid ${bank === b ? 'var(--primary)' : 'var(--border)'}`,
                      color: bank === b ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: bank === b ? 700 : 400,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>
                      🏦 {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet */}
            {method === 'wallet' && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Select Wallet</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { name: 'Paytm', icon: '💰' }, { name: 'PhonePe', icon: '📲' },
                    { name: 'Amazon Pay', icon: '🛒' }, { name: 'Mobikwik', icon: '📱' },
                  ].map(w => (
                    <button key={w.name} onClick={() => setBank(w.name)} style={{
                      padding: '12px', borderRadius: 10, textAlign: 'center',
                      background: bank === w.name ? 'var(--primary-light)' : 'var(--bg-card)',
                      border: `1.5px solid ${bank === w.name ? 'var(--primary)' : 'var(--border)'}`,
                      color: bank === w.name ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{w.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{w.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={processing}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--gradient-primary)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 16, fontWeight: 800,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.25s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              💳 Pay ₹{amount?.toLocaleString('en-IN')}
            </button>

            {/* Security Note */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
              <span style={{ fontSize: 12 }}>🔒</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>256-bit SSL encrypted · Demo mode</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// ── Main RazorpayButton component ──────────────────────────────────────────
const RazorpayButton = ({ amount, orderId, productName, onSuccess, disabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        id="razorpay-pay-btn"
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
        💳 Pay ₹{amount?.toLocaleString('en-IN')}
      </button>

      {modalOpen && (
        <MockPaymentModal
          amount={amount}
          orderId={orderId}
          onSuccess={onSuccess}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)', borderRadius: 10,
  color: 'var(--text-primary)', fontSize: 14,
  outline: 'none', transition: 'border-color 0.2s ease',
  fontFamily: 'inherit',
};

export default RazorpayButton;
