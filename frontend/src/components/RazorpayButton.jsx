import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { paymentService, loadRazorpay } from '../services/paymentService';

// ── Real Razorpay Checkout Integration ─────────────────────────────────────

const RazorpayButton = ({
  amount,
  orderId,       // Our MongoDB order _id (used for notes)
  productName,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create Razorpay order via backend
      const res = await paymentService.createOrder({
        amount,
        currency: 'INR',
        receipt: orderId || `order_${Date.now()}`,
        notes: { product: productName, order_id: orderId },
      });

      const razorpayOrder = res.data?.order || res.order;

      if (!razorpayOrder?.id) {
        toast.error('Could not initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'TechVault',
        description: productName || 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: {
          name:    customerName  || '',
          email:   customerEmail || '',
          contact: customerPhone || '',
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: '⚠️' });
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            // 4. Verify payment with backend
            await paymentService.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              order_id:            orderId,
              amount,
            });
            toast.success('🎉 Payment successful!');
            onSuccess?.(response);
          } catch (err) {
            toast.error('Payment verification failed. Contact support.');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      id="razorpay-pay-btn"
      onClick={handlePay}
      disabled={disabled || loading}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '14px 32px', width: '100%',
        background: (disabled || loading) ? 'var(--bg-elevated)' : 'var(--gradient-primary)',
        border: 'none', borderRadius: 'var(--radius-md)',
        color: '#fff', fontSize: 16, fontWeight: 700,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.7 : 1,
        transition: 'all 0.25s ease',
        fontFamily: 'inherit',
        boxShadow: (!disabled && !loading) ? 'var(--shadow-glow)' : 'none',
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading ? (
        <>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite' }} />
          Processing…
        </>
      ) : (
        <>💳 Pay ₹{amount?.toLocaleString('en-IN')}</>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default RazorpayButton;
