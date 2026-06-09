import axios from 'axios';

// In production: use deployed backend URL (set via VITE_API_URL env var)
// In development: use Vite proxy → '/api' → http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,   // 90s — Render free-tier can take up to 60s to cold start
  headers: { 'Content-Type': 'application/json' },
});

// ─── Warm up the Render server on app load (fire-and-forget) ────
// Render free tier sleeps after 15 min. Ping health endpoint early
// so server is ready before the user submits any form.
export const warmUpServer = () => {
  if (!import.meta.env.VITE_API_URL) return; // skip in local dev
  const BACKEND = import.meta.env.VITE_API_URL;
  axios.get(`${BACKEND}/api/health`, { timeout: 90000 })
    .then(() => console.log('✅ Server is awake'))
    .catch(() => console.log('⚠️ Server warm-up ping failed (will retry on request)'));
};

// ─── Retry helper for cold-start scenarios ───────────────────
const withRetry = async (fn, retries = 2, delayMs = 5000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error');
      if (isTimeout && i < retries) {
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
};

// Expose retry wrapper for use in auth context
export const apiWithRetry = (config) => withRetry(() => api(config));

// ─── Request Interceptor — attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    // storage.set() wraps values in JSON.stringify, so we must parse here
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
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const isNetworkError = error.message === 'Network Error';

    const msg =
      isTimeout
        ? '⏳ Server is waking up from sleep. Please try again in a moment.'
        : isNetworkError
        ? '🔌 Cannot reach server. Please check your connection and try again.'
        : error.response?.data?.message || error.message || 'Something went wrong';

    // Auto-logout on 401 — clear storage and redirect softly
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use hash navigation to avoid Vercel SPA 404
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(new Error(msg));
  }
);

export default api;
