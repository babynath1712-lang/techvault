import React, { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { formatPriceShort } from '../../utils/helpers';
import Table from '../../components/ui/Table';
import toast from 'react-hot-toast';

const MOCK_ORDERS = [
  { id: 'ORD-001', user: 'Arjun Kumar', product: 'iPhone 16', amount: 89999, status: 'Delivered', date: '28 May 2026', items: 1 },
  { id: 'ORD-002', user: 'Priya Sharma', product: 'Sony WH-1000XM6', amount: 34999, status: 'Shipped', date: '30 May 2026', items: 1 },
  { id: 'ORD-003', user: 'Rohan Singh', product: 'MacBook Pro M4', amount: 199999, status: 'Processing', date: '31 May 2026', items: 1 },
  { id: 'ORD-004', user: 'Ananya Gupta', product: 'Samsung Galaxy S24 Ultra', amount: 129999, status: 'Delivered', date: '29 May 2026', items: 1 },
  { id: 'ORD-005', user: 'Vikram Patel', product: 'Apple Watch Series 10', amount: 46999, status: 'Cancelled', date: '27 May 2026', items: 1 },
  { id: 'ORD-006', user: 'Meera Nair', product: 'Samsung Galaxy Buds3 Pro', amount: 17999, status: 'Shipped', date: '1 Jun 2026', items: 1 },
  { id: 'ORD-007', user: 'Karthik R', product: 'OnePlus 13', amount: 69999, status: 'Processing', date: '1 Jun 2026', items: 1 },
];

const STATUS_COLORS = {
  Delivered:  ['var(--success)', 'var(--success-light)'],
  Shipped:    ['#3b82f6', 'rgba(59,130,246,0.1)'],
  Processing: ['var(--warning)', 'var(--warning-light)'],
  Cancelled:  ['var(--error)', 'var(--error-light)'],
};

const ManageOrders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = orders.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.user.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} marked as ${newStatus}`);
  };

  const columns = [
    { header: 'Order ID', key: 'id', render: v => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{v}</span> },
    { header: 'Customer', key: 'user', render: v => <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span> },
    { header: 'Product', key: 'product', render: v => <span style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 160, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span> },
    { header: 'Amount', key: 'amount', render: v => <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatPriceShort(v)}</span> },
    { header: 'Date', key: 'date', render: v => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v}</span> },
    { header: 'Status', key: 'status', render: (v) => {
      const [color, bg] = STATUS_COLORS[v] || ['var(--text-muted)', 'var(--bg-elevated)'];
      return <span style={{ padding: '4px 10px', background: bg, color, borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{v}</span>;
    }},
    { header: 'Action', key: 'id', render: (id, row) => (
      <select
        value={row.status}
        onChange={(e) => updateStatus(id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '6px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer', outline: 'none' }}
      >
        {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Manage Orders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{filtered.length} orders</p>
        </div>
      </div>

      {/* Status Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...Object.keys(STATUS_COLORS)].map(s => {
          const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
          const [color] = s !== 'all' ? STATUS_COLORS[s] : ['var(--text-secondary)'];
          return (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: filterStatus === s ? 'var(--primary-light)' : 'var(--bg-card)',
              border: `1px solid ${filterStatus === s ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
              color: filterStatus === s ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}>
              {s === 'all' ? 'All' : s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <HiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order ID or customer…"
          style={{ width: '100%', paddingLeft: 42, padding: '10px 16px 10px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
      </div>

      <Table columns={columns} data={filtered} emptyText="No orders found." />
    </div>
  );
};

export default ManageOrders;
