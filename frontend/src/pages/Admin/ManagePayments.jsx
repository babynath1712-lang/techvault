import React, { useState } from 'react';
import { formatPriceShort } from '../../utils/helpers';
import Table from '../../components/ui/Table';
import toast from 'react-hot-toast';

const MOCK_PAYMENTS = [
  { id: 'PAY-001', orderId: 'ORD-001', user: 'Arjun Kumar', amount: 89999, method: 'UPI', status: 'Success', date: '28 May 2026', txnId: 'RZP001xyz' },
  { id: 'PAY-002', orderId: 'ORD-002', user: 'Priya Sharma', amount: 34999, method: 'Card', status: 'Success', date: '30 May 2026', txnId: 'RZP002abc' },
  { id: 'PAY-003', orderId: 'ORD-003', user: 'Rohan Singh', amount: 199999, method: 'Net Banking', status: 'Pending', date: '31 May 2026', txnId: 'RZP003def' },
  { id: 'PAY-004', orderId: 'ORD-004', user: 'Ananya Gupta', amount: 129999, method: 'UPI', status: 'Success', date: '29 May 2026', txnId: 'RZP004ghi' },
  { id: 'PAY-005', orderId: 'ORD-005', user: 'Vikram Patel', amount: 46999, method: 'Card', status: 'Refunded', date: '27 May 2026', txnId: 'RZP005jkl' },
];

const STATUS_COLORS = {
  Success:  ['var(--success)', 'var(--success-light)'],
  Pending:  ['var(--warning)', 'var(--warning-light)'],
  Failed:   ['var(--error)',   'var(--error-light)'],
  Refunded: ['var(--info)',    'rgba(59,130,246,0.1)'],
};

const ManagePayments = () => {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const totalRevenue = payments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
  const pendingAmt   = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const refundAmt    = payments.filter(p => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);

  const handleRefund = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Refunded' } : p));
    toast.success(`Refund processed for ${id}`);
  };

  const columns = [
    { header: 'Payment ID', key: 'id', render: v => <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', fontSize: 13 }}>{v}</span> },
    { header: 'Txn ID', key: 'txnId', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{v}</span> },
    { header: 'Customer', key: 'user', render: v => <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span> },
    { header: 'Amount', key: 'amount', render: v => <span style={{ fontWeight: 800, color: 'var(--success)' }}>{formatPriceShort(v)}</span> },
    { header: 'Method', key: 'method', render: v => <span style={{ padding: '3px 10px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{v}</span> },
    { header: 'Date', key: 'date', render: v => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v}</span> },
    { header: 'Status', key: 'status', render: v => {
      const [color, bg] = STATUS_COLORS[v] || ['var(--text-muted)', 'var(--bg-elevated)'];
      return <span style={{ padding: '4px 10px', background: bg, color, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{v}</span>;
    }},
    { header: 'Action', key: 'id', render: (id, row) => (
      row.status === 'Success' ? (
        <button onClick={() => handleRefund(id)} style={{ padding: '6px 12px', background: 'var(--warning-light)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: 'var(--warning)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Refund
        </button>
      ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
    )},
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Manage Payments</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{payments.length} transactions</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Revenue', value: formatPriceShort(totalRevenue), icon: '💰', color: 'var(--success)' },
          { label: 'Pending', value: formatPriceShort(pendingAmt), icon: '⏳', color: 'var(--warning)' },
          { label: 'Refunded', value: formatPriceShort(refundAmt), icon: '🔄', color: 'var(--info)' },
          { label: 'Transactions', value: payments.length, icon: '📊', color: 'var(--primary)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif" }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <Table columns={columns} data={payments} emptyText="No payments found." />
    </div>
  );
};

export default ManagePayments;
