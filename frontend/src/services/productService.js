import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (q) => api.get('/products/search', { params: { q } }),
  getByCategory: (cat) => api.get(`/products/category/${cat}`),
  getFeatured: () => api.get('/products/featured'),
};
