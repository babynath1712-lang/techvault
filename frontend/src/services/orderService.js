import api from './api';

export const orderService = {
  create:      (data)   => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById:     (id)     => api.get(`/orders/${id}`),
  cancel:      (id)     => api.patch(`/orders/${id}/cancel`),
  getAll:      (params) => api.get('/admin/orders', { params }),
  updateStatus:(id, status) => api.patch(`/orders/${id}/status`, { status }),
};
