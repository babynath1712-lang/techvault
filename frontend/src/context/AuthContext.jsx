import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { authService } from '../services/authService'; // backend not required for demo
import { storage } from '../utils/helpers';
import toast from 'react-hot-toast';

// ── Mock users for demo (no backend required) ──────────────────────────────
const MOCK_USERS = [
  { id: 1, name: 'Demo User',  email: 'user@demo.com',  password: 'Demo@1234',  role: 'user',  phone: '+91 98765 43210' },
  { id: 2, name: 'Admin User', email: 'admin@demo.com', password: 'Admin@1234', role: 'admin', phone: '+91 91234 56789' },
];


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => storage.get('user'));
  const [token, setToken]     = useState(() => storage.get('token'));
  const [cart, setCart]       = useState(() => storage.get('cart') || []);
  const [wishlist, setWishlist] = useState(() => storage.get('wishlist') || []);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  useEffect(() => { storage.set('cart', cart); }, [cart]);
  useEffect(() => { storage.set('wishlist', wishlist); }, [wishlist]);

  // ─── Auth Actions (mock — no backend needed) ────────────────
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 700));
    try {
      // Check built-in demo accounts
      let found = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      // Also check any accounts created via signup (stored in sessionStorage)
      if (!found) {
        const registered = JSON.parse(sessionStorage.getItem('registeredUsers') || '[]');
        found = registered.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
      }
      if (!found) {
        throw new Error('Invalid email or password. Try user@demo.com / Demo@1234');
      }
      const { password: _pw, ...safeUser } = found;
      const fakeToken = btoa(`${safeUser.id}:${safeUser.email}:${Date.now()}`);
      storage.set('token', fakeToken);
      storage.set('user', safeUser);
      setToken(fakeToken);
      setUser(safeUser);
      toast.success(`Welcome back, ${safeUser.name}! 👋`);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    try {
      // Check if email already taken
      const allUsers = [
        ...MOCK_USERS,
        ...JSON.parse(sessionStorage.getItem('registeredUsers') || '[]'),
      ];
      if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = { id: Date.now(), name, email, password, role: 'user', phone: '' };
      const registered = JSON.parse(sessionStorage.getItem('registeredUsers') || '[]');
      sessionStorage.setItem('registeredUsers', JSON.stringify([...registered, newUser]));
      toast.success('Account created! Please verify your email.');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.remove('token');
    storage.remove('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  }, []);

  // ─── Cart Actions ────────────────────────────────────────────
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

  // ─── Wishlist Actions ────────────────────────────────────────
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
      login, signup, logout,
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
