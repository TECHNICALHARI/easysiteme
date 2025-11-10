'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/superadmin.module.css';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import AdminPagination from '@/lib/frontend/superadmin/AdminPagination';
import CustomModal from '@/lib/frontend/common/CustomModal';
import { getContactsSuperAdmin } from '@/lib/frontend/api/services';

type ContactRow = {
    _id: string;
    name: string;
    email: string;
    message: string;
    ip?: string;
    createdAt?: string;
};

export default function SuperadminContactsPage() {
    const [contacts, setContacts] = useState<ContactRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);
    const [total, setTotal] = useState<number>(0);
    const [selected, setSelected] = useState<ContactRow | null>(null);
    const [error, setError] = useState<string | null>(null);

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'message', label: 'Message' },
        { key: 'ip', label: 'IP' },
        { key: 'createdAt', label: 'When', sortable: true },
    ];

    const fetchPage = async (p = 1, lim = limit) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getContactsSuperAdmin(p, lim);
            if (!res || !res.success) {
                throw new Error(res?.message || 'Failed to fetch');
            }
            const d = res.data ?? {};
            const items = Array.isArray(d.contacts) ? d.contacts : [];
            setContacts(
                items.map((it: any) => ({
                    ...it,
                    createdAt: it.createdAt ? new Date(it.createdAt).toLocaleString() : '',
                }))
            );
            setTotal(typeof d.total === 'number' ? d.total : Number(d.total || items.length));
            setPage(typeof d.page === 'number' ? d.page : p);
            setLimit(typeof d.limit === 'number' ? d.limit : lim);
        } catch (err: any) {
            console.error('fetch contacts error', err);
            setError(err?.message || 'Failed to fetch contacts');
            setContacts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage(1, limit);
    }, []);

    useEffect(() => {
        fetchPage(page, limit);
    }, [page, limit]);

    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

    return (
        <div className="grid gap-6">
            <h2 className={styles.pageTitle}>Contacts</h2>

            <div className={styles.card}>
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted">Total messages: <strong>{total}</strong></div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => fetchPage(1, limit)}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                        <select
                            className={styles.input}
                            value={limit}
                            onChange={(e) => {
                                const v = Number(e.target.value) || 20;
                                setLimit(v);
                                setPage(1); // reset to first page
                            }}
                            style={{ width: 120 }}
                        >
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                            <option value={100}>100 / page</option>
                        </select>
                    </div>
                </div>

                {error ? (
                    <div style={{ padding: 16 }} className="text-red-500">{error}</div>
                ) : (
                    <>
                        <AdminTable
                            columns={columns}
                            data={contacts.map((c) => ({
                                name: c.name,
                                email: c.email,
                                message: c.message,
                                ip: c.ip ?? '-',
                                createdAt: c.createdAt ?? '-',
                                _raw: c,
                            }))}
                            enablePagination={false}
                            renderActions={(row: any) => (
                                <div className="flex gap-3">
                                    <button onClick={() => setSelected(row._raw)} className={styles.actionIcon}>
                                        View
                                    </button>
                                </div>
                            )}
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

                        {loading && (
                            <div style={{ padding: 12 }} className="text-sm text-muted">Loading…</div>
                        )}
                    </>
                )}
            </div>

            {selected && (
                <CustomModal onClose={() => setSelected(null)} width="640px">
                    <h3 className="text-lg font-semibold text-brand mb-3">{selected.name}</h3>
                    <p><strong>Email:</strong> {selected.email}</p>
                    <p style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{selected.message}</p>
                    <p style={{ marginTop: 12 }}><strong>IP:</strong> {selected.ip || '-'}</p>
                    <p style={{ marginTop: 8 }}><strong>Sent:</strong> {selected.createdAt || '-'}</p>
                </CustomModal>
            )}
        </div>
    );
}
