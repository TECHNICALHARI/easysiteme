'use client';

import { useState } from 'react';
import styles from '@/styles/superadmin.module.css';
import { Eye, ShieldCheck, UserX, Search } from 'lucide-react';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import CustomModal from '@/lib/frontend/common/CustomModal';

const dummyUsers = [
  {
    id: 'u1',
    name: 'Raj Verma',
    email: 'raj@dev.com',
    plan: 'Premium',
    joined: '2025-06-10',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Anita Paul',
    email: 'anita@gmail.com',
    plan: 'Pro',
    joined: '2025-07-01',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Guest User',
    email: 'guest@example.com',
    plan: 'Free',
    joined: '2025-07-08',
    status: 'suspended',
  },
];

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan' },
  { key: 'joined', label: 'Joined' },
  { key: 'status', label: 'Status' },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All');

  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [impersonating, setImpersonating] = useState<any | null>(null);
  const [suspending, setSuspending] = useState<any | null>(null);

  const filtered = dummyUsers.filter((user) => {
    const matchQuery =
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase());

    const matchPlan =
      selectedPlan === 'All' || user.plan.toLowerCase() === selectedPlan.toLowerCase();

    return matchQuery && matchPlan;
  });

  return (
    <div className="grid gap-6">
      <h2 className={styles.pageTitle}>All Users</h2>

      {/* 🔍 Search + Filter */}
      <div className={styles.card}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-muted" />
            <input
              placeholder="Search by name or email"
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="premium-select"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📊 Table */}
      <AdminTable
        columns={columns}
        data={filtered}
        renderActions={(user) => (
          <div className="flex gap-3 cursor-pointer">
            <button title="View" onClick={() => setViewingUser(user)}>
              <Eye size={16} className="text-muted hover:text-brand" />
            </button>
            <button title="Impersonate" onClick={() => setImpersonating(user)}>
              <ShieldCheck size={16} className="text-muted hover:text-brand" />
            </button>
            <button title="Suspend" onClick={() => setSuspending(user)}>
              <UserX size={16} className="text-muted hover:text-red-500" />
            </button>
          </div>
        )}
      />

      {/* 👁️ View Modal */}
      {viewingUser && (
        <CustomModal onClose={() => setViewingUser(null)} width="400px">
          <h3 className="text-lg font-semibold text-brand mb-4">User Details</h3>
          <p><strong>Name:</strong> {viewingUser.name}</p>
          <p><strong>Email:</strong> {viewingUser.email}</p>
          <p><strong>Plan:</strong> {viewingUser.plan}</p>
          <p><strong>Joined:</strong> {viewingUser.joined}</p>
        </CustomModal>
      )}

      {/* 👤 Impersonate Modal */}
      {impersonating && (
        <CustomModal onClose={() => setImpersonating(null)} width="400px">
          <h3 className="text-lg font-semibold text-brand mb-4">Impersonate</h3>
          <p>You are about to impersonate <strong>{impersonating.name}</strong>.</p>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setImpersonating(null)} className="text-sm text-muted">Cancel</button>
            <button className={styles.btnPrimary}>Continue</button>
          </div>
        </CustomModal>
      )}

      {/* ⛔ Suspend Modal */}
      {suspending && (
        <CustomModal onClose={() => setSuspending(null)} width="400px">
          <h3 className="text-lg font-semibold text-red-500 mb-4">Suspend User</h3>
          <p>Are you sure you want to suspend <strong>{suspending.name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setSuspending(null)} className="text-sm text-muted">Cancel</button>
            <button className="text-sm bg-red-500 text-white px-4 py-2 rounded-md">Suspend</button>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
