// ─── Format Helpers ────────────────────────────────────────────

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatPriceShort = (price) => `₹${price.toLocaleString('en-IN')}`;

export const calcDiscount = (original, price) =>
  Math.round(((original - price) / original) * 100);

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const timeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  const intervals = [
    [Math.floor(seconds / 31536000), 'year'],
    [Math.floor(seconds / 2592000), 'month'],
    [Math.floor(seconds / 86400), 'day'],
    [Math.floor(seconds / 3600), 'hour'],
    [Math.floor(seconds / 60), 'minute'],
  ];
  for (const [val, unit] of intervals) {
    if (val >= 1) return `${val} ${unit}${val > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

// ─── Array / Object Helpers ────────────────────────────────────

export const sortProducts = (products, sort) => {
  const arr = [...products];
  switch (sort) {
    case 'price-asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating':     return arr.sort((a, b) => b.rating - a.rating);
    case 'newest':     return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default:           return arr.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
};

export const filterProducts = (products, { category, priceRange, brands, search }) => {
  return products.filter(p => {
    if (category && category !== 'all' && p.category !== category) return false;
    if (priceRange) {
      const { min, max } = priceRange;
      if (p.price < min || p.price > max) return false;
    }
    if (brands && brands.length > 0 && !brands.includes(p.brand)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

// ─── Cart Helpers ──────────────────────────────────────────────

export const calcCartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const calcCartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

// ─── String Helpers ────────────────────────────────────────────

export const truncate = (str, n) =>
  str.length > n ? str.slice(0, n) + '…' : str;

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// ─── Storage Helpers ───────────────────────────────────────────

export const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },
  set: (key, val) => { localStorage.setItem(key, JSON.stringify(val)); },
  remove: (key) => { localStorage.removeItem(key); },
};

// ─── Rating Stars ──────────────────────────────────────────────

export const renderStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'var(--error)' };
  if (stock <= 5)  return { label: `Only ${stock} left!`, color: 'var(--warning)' };
  return { label: 'In Stock', color: 'var(--success)' };
};
