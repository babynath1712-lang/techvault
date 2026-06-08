import api from './api';

export const adminService = {
  getDashboard: ()       => api.get('/admin/dashboard'),
  getUsers:     (params) => api.get('/admin/users', { params }),
  getOrders:    (params) => api.get('/admin/orders', { params }),
  getPayments:  (params) => api.get('/admin/payments', { params }),
  getProducts:  (params) => api.get('/admin/products', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id)    => api.patch(`/admin/users/${id}/toggle-status`),
};
