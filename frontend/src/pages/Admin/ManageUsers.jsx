import React, { useState } from 'react';
import { HiSearch, HiBan, HiCheck } from 'react-icons/hi';
import Table from '../../components/ui/Table';
import toast from 'react-hot-toast';

const MOCK_USERS = [
  { id: 1, name: 'Arjun Kumar', email: 'arjun@demo.com', role: 'user', joined: '1 Jan 2026', orders: 12, status: 'Active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@demo.com', role: 'user', joined: '15 Feb 2026', orders: 7, status: 'Active' },
  { id: 3, name: 'Rohan Singh', email: 'rohan@demo.com', role: 'user', joined: '3 Mar 2026', orders: 4, status: 'Blocked' },
  { id: 4, name: 'Ananya Gupta', email: 'ananya@demo.com', role: 'admin', joined: '10 Jan 2026', orders: 2, status: 'Active' },
  { id: 5, name: 'Vikram Patel', email: 'vikram@demo.com', role: 'user', joined: '22 Apr 2026', orders: 9, status: 'Active' },
  { id: 6, name: 'Meera Nair', email: 'meera@demo.com', role: 'user', joined: '5 May 2026', orders: 3, status: 'Active' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
    const user = users.find(u => u.id === id);
    toast.success(`User ${user.status === 'Active' ? 'blocked' : 'unblocked'}`);
  };

  const columns = [
    { header: '#', key: 'id', render: v => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>#{v}</span> },
    { header: 'User', key: 'name', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
          {v.charAt(0)}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{v}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Role', key: 'role', render: v => <span style={{ padding: '3px 10px', background: v === 'admin' ? 'var(--primary-light)' : 'var(--bg-elevated)', color: v === 'admin' ? 'var(--primary)' : 'var(--text-secondary)', border: `1px solid ${v === 'admin' ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`, borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{v}</span> },
    { header: 'Joined', key: 'joined', render: v => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v}</span> },
    { header: 'Orders', key: 'orders', render: v => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{v}</span> },
    { header: 'Status', key: 'status', render: v => <span style={{ padding: '3px 10px', background: v === 'Active' ? 'var(--success-light)' : 'var(--error-light)', color: v === 'Active' ? 'var(--success)' : 'var(--error)', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{v}</span> },
    { header: 'Action', key: 'id', render: (id, row) => (
      <button onClick={() => toggleBlock(id)} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        background: row.status === 'Active' ? 'var(--error-light)' : 'var(--success-light)',
        border: `1px solid ${row.status === 'Active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
        color: row.status === 'Active' ? 'var(--error)' : 'var(--success)',
      }}>
        {row.status === 'Active' ? <><HiBan size={13} /> Block</> : <><HiCheck size={13} /> Unblock</>}
      </button>
    )},
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Manage Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{filtered.length} users registered</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{label:'Total',val:users.length,c:'var(--primary)'},{label:'Active',val:users.filter(u=>u.status==='Active').length,c:'var(--success)'},{label:'Blocked',val:users.filter(u=>u.status==='Blocked').length,c:'var(--error)'}].map(({label,val,c})=>(
            <div key={label} style={{ textAlign:'center', padding:'10px 16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10 }}>
              <div style={{ fontSize:18, fontWeight:800, color:c }}>{val}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <HiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
          style={{ width: '100%', paddingLeft: 42, padding: '10px 16px 10px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
      </div>

      <Table columns={columns} data={filtered} emptyText="No users found." />
    </div>
  );
};

export default ManageUsers;
