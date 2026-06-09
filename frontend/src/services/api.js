import axios from 'axios';

// In production: use deployed backend URL (set via VITE_API_URL env var)
// In development: use Vite proxy → '/api' → http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,  // 15s for normal requests — server must be awake before we call
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('token');
    const token = raw ? JSON.parse(raw) : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle errors globally ────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    // Auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(new Error(msg));
  }
);

export default api;
