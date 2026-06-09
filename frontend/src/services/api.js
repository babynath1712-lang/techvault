import axios from 'axios';

// Production backend URL — hardcoded so it never depends on Vercel env vars
const PROD_BACKEND = 'https://techvault-qm2w.onrender.com';

// In production builds: go directly to Render backend
// In local dev: use Vite proxy → '/api' → http://localhost:5000
const BASE_URL = import.meta.env.PROD
  ? `${PROD_BACKEND}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
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
