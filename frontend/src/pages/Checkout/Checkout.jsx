import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheck, HiArrowLeft, HiLockClosed } from 'react-icons/hi';
import { useAuthContext } from '../../context/AuthContext';
import { formatPriceShort } from '../../utils/helpers';
import { validateCheckout, hasErrors } from '../../utils/validators';
import { orderService } from '../../services/orderService';
import Input from '../../components/ui/Input';
import UPIPaymentButton from '../../components/RazorpayButton';
import toast from 'react-hot-toast';

const STEPS = ['Cart Review', 'Shipping', 'Payment'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, user } = useAuthContext();
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState({
    fullName: user?.name || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    address: '', city: '', pincode: '', state: '',
  });
  const [errors, setErrors]       = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [realOrderId, setRealOrderId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleNextStep = async () => {
    if (step === 1) {
      const errs = validateCheckout(form);
      setErrors(errs);
      if (hasErrors(errs)) return;

      // Step 1 → 2: Create real order in DB
      setCreatingOrder(true);
      try {
        const orderData = {
          items: cart.map(item => ({
            product_id:   item._id || String(item.id),
            product_name: item.name,
            quantity:     item.quantity,
            price:        item.price,
            image:        item.image,
          })),
          shipping_address: {
            full_name: form.fullName,
            phone:     form.phone,
            address:   form.address,
            city:      form.city,
            state:     form.state,
            pincode:   form.pincode,
            country:   'India',
          },
          total_amount: grandTotal,
          payment_method: 'razorpay',
        };

        const res = await orderService.create(orderData);
        const order = res.data?.order || res.order;
        setRealOrderId(order?._id || order?.id);
        toast.success('Order created! Proceed to payment.');
        setStep(s => s + 1);
      } catch (err) {
        toast.error(err.message || 'Failed to create order. Please try again.');
      } finally {
        setCreatingOrder(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  const handleSuccess = () => {
    setOrderPlaced(true);
    clearCart();
    toast.success('🎉 Payment successful! Order confirmed.');
  };

  if (cart.length === 0 && !orderPlaced) return (
    <div className="empty-state" style={{ minHeight: '100vh' }}>
      <div style={{ fontSize: 48 }}>🛒</div>
      <h3 className="empty-state-title">Your cart is empty</h3>
      <button onClick={() => navigate('/products')} style={{ padding: '10px 24px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
        Browse Products
      </button>
    </div>
  );

  if (orderPlaced) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', animation: 'scaleIn 0.5s ease' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--success-light)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40 }}>
          ✅
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Order Placed! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>Thank you for your purchase!</p>
        {realOrderId && (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            Order ID: <strong style={{ color: 'var(--primary)' }}>#{realOrderId.slice(-8).toUpperCase()}</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 28px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            View Orders
          </button>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 28px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 15, cursor: 'pointer' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  const shippingFee = cartTotal > 50000 ? 0 : 199;
  const grandTotal  = cartTotal + shippingFee;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 32, paddingBottom: 60 }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 8 }}>
            <HiArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Checkout</h1>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, maxWidth: 480 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i <= step ? 'var(--gradient-primary)' : 'var(--bg-elevated)',
                  border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: i <= step ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.3s ease',
                }}>
                  {i < step ? <HiCheck size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 400, color: i <= step ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? 'var(--primary)' : 'var(--border)', margin: '0 12px', transition: 'background 0.3s ease' }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }} className="checkout-grid">
          {/* Left: Steps */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32 }}>
            {/* Step 0: Cart Review */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Review Cart</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 12 }}>
                      <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, background: 'var(--bg-secondary)', padding: 4 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.name}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>
                        {formatPriceShort(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <button onClick={handleNextStep} style={{ marginTop: 24, width: '100%', padding: '14px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Shipping Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <Input label="Full Name" id="full-name" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required />
                  </div>
                  <Input label="Email" id="checkout-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} required />
                  <Input label="Phone" id="checkout-phone" placeholder="10-digit number" value={form.phone} onChange={set('phone')} error={errors.phone} required />
                  <div style={{ gridColumn: '1/-1' }}>
                    <Input label="Address" id="address" placeholder="House No., Street, Locality" value={form.address} onChange={set('address')} error={errors.address} required />
                  </div>
                  <Input label="City" id="city" placeholder="Mumbai" value={form.city} onChange={set('city')} error={errors.city} required />
                  <Input label="State" id="state" placeholder="Maharashtra" value={form.state} onChange={set('state')} />
                  <Input label="Pincode" id="pincode" placeholder="400001" value={form.pincode} onChange={set('pincode')} error={errors.pincode} required />
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={creatingOrder}
                  style={{ marginTop: 24, width: '100%', padding: '14px', background: creatingOrder ? 'var(--bg-elevated)' : 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: creatingOrder ? 'not-allowed' : 'pointer', opacity: creatingOrder ? 0.7 : 1 }}
                >
                  {creatingOrder ? '⏳ Creating Order…' : 'Continue to Payment →'}
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Payment</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '10px 16px', background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                  <HiLockClosed size={16} style={{ color: 'var(--success)' }} />
                  <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Secure UPI Payment · sivambabynath@okicic</span>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 12, marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Delivering to:</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{form.fullName}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{form.address}, {form.city}, {form.pincode}</p>
                </div>
                <UPIPaymentButton
                  amount={grandTotal}
                  orderId={realOrderId}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600, flexShrink: 0 }}>{formatPriceShort(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>Subtotal</span><span>{formatPriceShort(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                  {shippingFee === 0 ? 'FREE' : formatPriceShort(shippingFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{formatPriceShort(grandTotal)}</span>
              </div>
              {cartTotal > 50000 && <p style={{ fontSize: 11, color: 'var(--success)', marginTop: 8, fontWeight: 600 }}>✓ You qualify for FREE shipping!</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:768px) {
          .checkout-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
