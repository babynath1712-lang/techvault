import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/helpers';
import toast from 'react-hot-toast';

// Helper: retry async fn up to `retries` times on timeout/network error
const retryOnColdStart = async (fn, retries = 2, delayMs = 6000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isTransient = err.message?.includes('waking up') ||
        err.message?.includes('timeout') ||
        err.message?.includes('Network Error') ||
        err.message?.includes('cannot reach server');
      if (isTransient && i < retries) {
        toast.loading(`⏳ Server is waking up… retrying (${i + 1}/${retries})`, { id: 'cold-start' });
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      toast.dismiss('cold-start');
      throw err;
    }
  }
  toast.dismiss('cold-start');
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(() => storage.get('user'));
  const [token, setToken]       = useState(() => storage.get('token'));
  const [cart, setCart]         = useState(() => storage.get('cart') || []);
  const [wishlist, setWishlist] = useState(() => storage.get('wishlist') || []);
  const [loading, setLoading]   = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  useEffect(() => { storage.set('cart', cart); }, [cart]);
  useEffect(() => { storage.set('wishlist', wishlist); }, [wishlist]);

  // ─── Fetch fresh user profile on load ────────────────────────
  useEffect(() => {
    if (token && !user) {
      authService.getMe()
        .then(res => {
          const u = res.data?.user || res.user;
          if (u) { setUser(u); storage.set('user', u); }
        })
        .catch(() => {
          // Token expired — force logout
          storage.remove('token');
          storage.remove('user');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  // ─── Login ────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { token: jwt, user: u } = res.data || res;
      storage.set('token', jwt);
      storage.set('user', u);
      setToken(jwt);
      setUser(u);
      toast.success(`Welcome back, ${u.name}! 👋`);
      return { success: true, user: u };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Register ─────────────────────────────────────────────────
  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    try {
      await retryOnColdStart(() => authService.register({ name, email, password }));
      toast.dismiss('cold-start');
      toast.success('Account created! Please verify your email with the OTP sent.');
      return { success: true };
    } catch (err) {
      toast.dismiss('cold-start');
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    storage.remove('token');
    storage.remove('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  }, []);

  // ─── Update user in context (used after profile save) ────────
  const updateUser = useCallback((updated) => {
    setUser(updated);
    storage.set('user', updated);
  }, []);

  // ─── Cart Actions ─────────────────────────────────────────────
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success('Cart updated!');
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success('Removed from cart.');
  }, []);

  const updateCartQty = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ─── Wishlist Actions ─────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        toast.success('Removed from wishlist.');
        return prev.filter(p => p.id !== product.id);
      }
      toast.success('Added to wishlist!');
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId) =>
    wishlist.some(p => p.id === productId), [wishlist]);

  const isInCart = useCallback((productId) =>
    cart.some(item => item.id === productId), [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated, isAdmin,
      cart, cartCount, cartTotal,
      wishlist, isInWishlist, isInCart,
      login, signup, logout, updateUser,
      addToCart, removeFromCart, updateCartQty, clearCart,
      toggleWishlist,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
