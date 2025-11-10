'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/superadmin.module.css';
import { Eye, ShieldCheck, UserX, Search } from 'lucide-react';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import AdminPagination from '@/lib/frontend/superadmin/AdminPagination';
import CustomModal from '@/lib/frontend/common/CustomModal';
import { getUsersSuperAdmin, setFeaturedSuperAdmin, getFeaturedMakersPublicApi } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type UserRow = {
  _id: string;
  email?: string;
  subdomain?: string;
  plan?: string;
  createdAt?: string;
  roles?: string[];
  profile?: { fullName?: string };
  settings?: { featured?: boolean; featuredRank?: number; subdomain?: string };
};

export default function AdminUsersPage() {
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All');

  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [impersonating, setImpersonating] = useState<UserRow | null>(null);
  const [suspending, setSuspending] = useState<UserRow | null>(null);

  const [editingRankUser, setEditingRankUser] = useState<UserRow | null>(null);
  const [rankValue, setRankValue] = useState<number | "">("");

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'plan', label: 'Plan' },
    { key: 'createdAt', label: 'Joined' },
    { key: 'status', label: 'Status' },
    { key: 'featured', label: 'Featured' },
    { key: 'rank', label: 'Rank' },
  ];


  const fetchPage = async (opts?: { p?: number; lim?: number; q?: string; plan?: string }) => {
    const p = opts?.p ?? page;
    const lim = opts?.lim ?? limit;
    const q = opts?.q ?? query;
    const plan = opts?.plan ?? selectedPlan;

    setLoading(true);
    setError(null);

    try {
      const params: any = { page: p, limit: lim };
      if (q && q.trim()) params.q = q.trim();
      if (plan && plan !== 'All') params.plan = plan;
      const res = await getUsersSuperAdmin(params);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to fetch users');
      const d = res.data ?? {};
      const rows = Array.isArray(d.users) ? d.users : [];

      let featuredRows: any[] = [];
      try {
        const f = await getFeaturedMakersPublicApi({ limit: 200 });
        if (Array.isArray(f)) featuredRows = f;
      } catch (e) {
        featuredRows = [];
      }

      const featuredMap: Record<string, { featured: boolean; rank: number }> = {};
      for (const fr of featuredRows) {
        const sd = (fr.subdomain || '').toString().toLowerCase().trim();
        if (!sd) continue;
        featuredMap[sd] = { featured: true, rank: typeof fr.rank === 'number' ? fr.rank : 0 };
      }

      setUsers(
        rows.map((u: any) => {
          const sub = (u.subdomain || (u.settings?.subdomain || '') || '').toString().toLowerCase();
          const fm = featuredMap[sub] || { featured: false, rank: 0 };
          return {
            _id: u._id,
            email: u.email || '',
            subdomain: u.subdomain || (u.settings?.subdomain || ''),
            plan: u.plan || '',
            createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : '',
            roles: Array.isArray(u.roles) ? u.roles : [],
            profile: u.profile || {},
            settings: {
              ...(u.settings || {}),
              featured: fm.featured,
              featuredRank: fm.rank,
              subdomain: u.subdomain || (u.settings?.subdomain || ''),
            },
          } as UserRow;
        })
      );
      setTotal(typeof d.total === 'number' ? d.total : Number(d.total || rows.length));
      setPage(typeof d.page === 'number' ? d.page : p);
      setLimit(typeof d.limit === 'number' ? d.limit : lim);
    } catch (err: any) {
      console.error('fetch users err', err);
      setError(err?.message || 'Failed to load users');
      setUsers([]);
      setTotal(0);
      showToast(err?.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage({ p: 1, lim: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPage({ p: page, lim: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSearch = () => {
    setPage(1);
    fetchPage({ p: 1, lim: limit, q: query });
  };

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    setPage(1);
    fetchPage({ p: 1, lim: limit, q: query, plan });
  };

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const toggleFeatured = async (u: UserRow) => {
    const sub = (u.subdomain || u.settings?.subdomain || '').toString().trim();
    if (!sub) {
      showToast('User has no subdomain', 'error');
      return;
    }
    const newVal = !Boolean(u.settings?.featured);
    try {
      await setFeaturedSuperAdmin({
        subdomain: sub,
        featured: newVal,
        rank: typeof u.settings?.featuredRank === 'number' ? u.settings.featuredRank : 0,
      });
      await fetchPage({ p: page, lim: limit });
      showToast(newVal ? 'User marked as featured' : 'User removed from featured', 'success');
    } catch (err: any) {
      console.error('toggle feature err', err);
      showToast(err?.message || 'Failed to update featured status', 'error');
    }
  };

  const openEditRank = (u: UserRow) => {
    setEditingRankUser(u);
    setRankValue(typeof u.settings?.featuredRank === 'number' ? u.settings.featuredRank : 0);
  };

  const saveRank = async () => {
    if (!editingRankUser) return;
    const sub = (editingRankUser.subdomain || editingRankUser.settings?.subdomain || '').toString().trim();
    if (!sub) {
      showToast('No subdomain', 'error');
      return;
    }
    const r = Number(rankValue || 0);
    if (!Number.isFinite(r) || r < 0) {
      showToast('Rank must be a non-negative number', 'error');
      return;
    }
    try {
      await setFeaturedSuperAdmin({ subdomain: sub, featured: true, rank: Math.floor(r) });
      setEditingRankUser(null);
      await fetchPage({ p: page, lim: limit });
      showToast('Featured rank updated.', 'success');
    } catch (err: any) {
      console.error('save rank err', err);
      showToast(err?.message || 'Failed to update rank', 'error');
    }
  };

  return (
    <div className="grid gap-6">
      <h2 className={styles.pageTitle}>All Users</h2>

      <div className={styles.card}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-muted" />
            <input
              placeholder="Search by name, email or subdomain"
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.btnPrimary} onClick={handleSearch} style={{ marginLeft: 8 }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              className="premium-select"
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
            >
              <option value="All">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>

            <select
              className={styles.input}
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value) || 20;
                setLimit(v);
                setPage(1);
              }}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <AdminTable
          columns={columns}
          data={users.map((u) => ({
            name: u.profile?.fullName || u.subdomain || u.email || '',
            email: u.email || '',
            plan: u.plan,
            joined: u.createdAt,
            status: 'active',
            featured: u.settings?.featured ? 'Yes' : 'No',
            rank: typeof u.settings?.featuredRank === 'number' ? u.settings.featuredRank : '-',
            _raw: u,
          }))}
          enablePagination={false}
          renderActions={(row: any) => {
            const u: UserRow = row._raw;
            const isFeatured = Boolean(u.settings?.featured);
            return (
              <div className="flex gap-3 cursor-pointer">
                <button title="View" onClick={() => setViewingUser(u)}>
                  <Eye size={16} className="text-muted hover:text-brand" />
                </button>

                <button title="Impersonate" onClick={() => setImpersonating(u)}>
                  <ShieldCheck size={16} className="text-muted hover:text-brand" />
                </button>

                <button title="Suspend" onClick={() => setSuspending(u)}>
                  <UserX size={16} className="text-muted hover:text-red-500" />
                </button>

                <button
                  title={isFeatured ? 'Unfeature' : 'Feature'}
                  onClick={() => toggleFeatured(u)}
                  className="ml-2"
                >
                  {isFeatured ? 'Unfeature' : 'Feature'}
                </button>

                <button title="Edit Rank" onClick={() => openEditRank(u)} style={{ marginLeft: 4 }}>
                  Edit Rank
                </button>
              </div>
            );
          }}
        />

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          <AdminPagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
            pageSize={limit}
            onPageSizeChange={(s) => {
              setLimit(s);
              setPage(1);
            }}
          />
        </div>

        {loading && <div className="text-sm text-muted mt-3">Loading…</div>}
      </div>

      {viewingUser && (
        <CustomModal onClose={() => setViewingUser(null)} width="480px">
          <h3 className="text-lg font-semibold text-brand mb-4">User Details</h3>
          <p><strong>Name:</strong> {viewingUser.profile?.fullName || '-'}</p>
          <p><strong>Email:</strong> {viewingUser.email}</p>
          <p><strong>Plan:</strong> {viewingUser.plan}</p>
          <p><strong>Joined:</strong> {viewingUser.createdAt}</p>
          <p><strong>Subdomain:</strong> {viewingUser.subdomain || '-'}</p>
        </CustomModal>
      )}

      {impersonating && (
        <CustomModal onClose={() => setImpersonating(null)} width="400px">
          <h3 className="text-lg font-semibold text-brand mb-4">Impersonate</h3>
          <p>You are about to impersonate <strong>{impersonating.email}</strong>.</p>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setImpersonating(null)} className="text-sm text-muted">Cancel</button>
            <button className={styles.btnPrimary}>Continue</button>
          </div>
        </CustomModal>
      )}

      {suspending && (
        <CustomModal onClose={() => setSuspending(null)} width="400px">
          <h3 className="text-lg font-semibold text-red-500 mb-4">Suspend User</h3>
          <p>Are you sure you want to suspend <strong>{suspending.email}</strong>?</p>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setSuspending(null)} className="text-sm text-muted">Cancel</button>
            <button className="text-sm bg-red-500 text-white px-4 py-2 rounded-md">Suspend</button>
          </div>
        </CustomModal>
      )}

      {editingRankUser && (
        <CustomModal onClose={() => setEditingRankUser(null)} width="420px">
          <h3 className="text-lg font-semibold text-brand mb-4">Edit Featured Rank</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ minWidth: 80 }}>Rank</label>
            <input
              type="number"
              value={rankValue}
              onChange={(e) => setRankValue(e.target.value === '' ? '' : Number(e.target.value))}
              className={styles.input}
              min={0}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button onClick={() => setEditingRankUser(null)} className="text-sm text-muted">Cancel</button>
            <button onClick={saveRank} className={styles.btnPrimary}>Save</button>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
