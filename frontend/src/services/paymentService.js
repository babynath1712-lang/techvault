import api from './api';

export const paymentService = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
  getById: (id) => api.get(`/payments/${id}`),
  getAllAdmin: (params) => api.get('/payments/admin/all', { params }),
  refund: (id) => api.post(`/payments/${id}/refund`),
};

export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
