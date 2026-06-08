import React, { useState } from 'react';
import { HiSearch, HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi';
import { PRODUCTS, CATEGORIES } from '../../utils/constants';
import { formatPriceShort } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([...PRODUCTS]);
  const [search, setSearch]     = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const filtered = products.filter(p =>
    (filterCat === 'all' || p.category === filterCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    toast.success('Product deleted.');
  };

  const columns = [
    { header: 'Product', key: 'name', render: (_, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={row.image} alt={row.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, background: 'var(--bg-elevated)', padding: 4 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</p>
          <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{row.brand}</p>
        </div>
      </div>
    )},
    { header: 'Category', key: 'category', render: (v) => <span style={{ padding: '3px 10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{v}</span> },
    { header: 'Price', key: 'price', render: (v) => <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatPriceShort(v)}</span> },
    { header: 'Stock', key: 'stock', render: (v) => <span style={{ color: v === 0 ? 'var(--error)' : v <= 5 ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>{v}</span> },
    { header: 'Rating', key: 'rating', render: (v) => <span style={{ color: '#f59e0b', fontWeight: 700 }}>⭐ {v}</span> },
    { header: 'Actions', key: 'id', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setEditProduct(row)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          <HiPencil size={13} /> Edit
        </button>
        <button onClick={() => setDeleteId(row.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'var(--error-light)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: 'var(--error)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          <HiTrash size={13} /> Delete
        </button>
      </div>
    )},
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Manage Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{filtered.length} of {products.length} products</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <HiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <HiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            style={{ width: '100%', paddingLeft: 42, padding: '10px 16px 10px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <Table columns={columns} data={filtered} emptyText="No products match your search." />

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Are you sure you want to delete this product? This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '12px', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Delete
          </button>
          <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title={`Edit: ${editProduct?.name}`} size="md">
        {editProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Price (₹)</label>
              <input
                type="number"
                defaultValue={editProduct.price}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 15, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Stock</label>
              <input
                type="number"
                defaultValue={editProduct.stock}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 15, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => { toast.success('Product updated!'); setEditProduct(null); }} style={{ flex: 1, padding: '12px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Save Changes
              </button>
              <button onClick={() => setEditProduct(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageProducts;
