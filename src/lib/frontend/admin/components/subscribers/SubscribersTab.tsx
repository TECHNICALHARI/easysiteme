'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import LockedOverlay from '../../layout/LockedOverlay';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import ManageSubscribersModal from './ManageSubscribersModal';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import type { SubscriberDataTypes } from '@/lib/frontend/types/form';
import {
    getSubscribersServiceAPI,
    saveSubscribersServiceAPI,
} from '@/lib/frontend/api/services';

const Section = ({
    title,
    sub,
    right,
    children,
}: {
    title?: string | React.ReactNode;
    sub?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className={styles.sectionMain}>
        {(title || right) && (
            <div className={styles.SecHeadAndBtn}>
                {title && <h4 className={styles.sectionLabel}>{title}</h4>}
                {right}
            </div>
        )}
        {sub && <p className="text-sm text-muted mb-2">{sub}</p>}
        {children}
    </div>
);

export default function SubscribersTab() {
    const { subscriberSettings, setSubscriberSettings, plan } = useAdminForm() as {
        subscriberSettings: SubscriberDataTypes;
        setSubscriberSettings: (
            next:
                | SubscriberDataTypes
                | ((p: SubscriberDataTypes) => SubscriberDataTypes)
        ) => void;
        plan: keyof typeof PLAN_FEATURES;
    };

    const { showToast } = useToast();
    const limits = PLAN_FEATURES[plan] ?? {};
    const [showManageModal, setShowManageModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const subscriberList =
        subscriberSettings?.SubscriberList ?? {
            data: [],
            total: 0,
            active: 0,
            unsubscribed: 0,
        };
    const subscribers = subscriberList.data ?? [];
    const total = subscriberList.total ?? 0;
    const active = subscriberList.active ?? 0;
    const unsubscribed = subscriberList.unsubscribed ?? 0;

    const isSubscribeEnabled = Boolean(limits.showSubscribers);

    const columns = [
        { key: 'email', label: 'Email', sortable: true },
        { key: 'subscribedOn', label: 'Subscribed On', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
    ];

    const fetchSubscribers = async (signal?: AbortSignal) => {
        if (!isSubscribeEnabled) return;
        setLoading(true);
        try {
            const res = await getSubscribersServiceAPI();
            const payload = res?.data ?? {};
            const nextList =
                payload?.SubscriberList ??
                payload ??
                ({ data: [], total: 0, active: 0, unsubscribed: 0 } as any);

            setSubscriberSettings((prev: any) => ({
                ...prev,
                SubscriberList: nextList,
                subscriberSettings:
                    payload?.subscriberSettings ?? prev?.subscriberSettings ?? {},
            }));
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                showToast(err?.message || 'Failed to load subscribers', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const ac = new AbortController();
        fetchSubscribers(ac.signal);
        return () => ac.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan]);

    const handleManageSettings = async (
        data: SubscriberDataTypes['subscriberSettings']
    ) => {
        setSaving(true);
        try {
            const res = await saveSubscribersServiceAPI({
                subscriberSettings: data,
            });
            const saved =
                (res?.data?.subscriberSettings as SubscriberDataTypes['subscriberSettings']) ??
                data;

            setSubscriberSettings((prev) => ({
                ...prev,
                subscriberSettings: {
                    ...(prev?.subscriberSettings || {}),
                    ...(saved || {}),
                },
            }));
            showToast(res?.message || 'Subscriber settings updated', 'success');
            setShowManageModal(false);
        } catch (err: any) {
            showToast(err?.message || 'Failed to update settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Subscribers & Email List</h3>
                <p>
                    Collect subscribers from your page, track activity, and manage
                    communication settings.
                </p>
            </div>

            <Section
                title={
                    <>
                        Your Subscribers <span className="badge-pro">Pro</span>
                    </>
                }
                right={
                    <div className="flex gap-3">
                        <button
                            className="btn-secondary"
                            disabled={!isSubscribeEnabled || loading}
                            onClick={() => fetchSubscribers()}
                        >
                            {loading ? 'Refreshing…' : 'Refresh'}
                        </button>
                        <button
                            className="btn-secondary gap-2"
                            disabled={!isSubscribeEnabled || saving}
                            onClick={() => setShowManageModal(true)}
                        >
                            <Settings size={16} />
                            {saving ? 'Saving…' : 'Manage Settings'}
                        </button>
                    </div>
                }
                sub="View your subscriber list, send updates, and customize opt-in preferences."
            >
                <LockedOverlay enabled={isSubscribeEnabled} mode="overlay">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Total</h4>
                            <p>{total}</p>
                        </div>
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Active</h4>
                            <p>{active}</p>
                        </div>
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Unsubscribed</h4>
                            <p>{unsubscribed}</p>
                        </div>
                    </div>

                    <div className={styles.SubsTableMain}>
                        <h4 className="mb-3">Subscriber List</h4>
                        {loading ? (
                            <p className="text-sm text-muted">Loading subscribers…</p>
                        ) : subscribers.length > 0 ? (
                            <AdminTable columns={columns} data={subscribers} />
                        ) : (
                            <p className="text-sm text-muted">
                                No subscribers yet. Once users subscribe through your page,
                                they’ll appear here.
                            </p>
                        )}
                    </div>
                </LockedOverlay>
            </Section>

            {showManageModal && (
                <ManageSubscribersModal
                    onClose={() => setShowManageModal(false)}
                    onSave={handleManageSettings}
                    initialData={subscriberSettings?.subscriberSettings}
                />
            )}
        </div>
    );
}
