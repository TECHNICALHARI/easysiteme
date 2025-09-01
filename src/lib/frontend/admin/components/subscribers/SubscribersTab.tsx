'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import styles from '@/styles/admin.module.css';

import LockedOverlay from '../../layout/LockedOverlay';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import ManageSubscribersModal from './ManageSubscribersModal';

import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { SubscriberDataTypes } from '@/lib/frontend/types/form';

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
    const { form, setForm, plan } = useAdminForm();
    const limits = PLAN_FEATURES[plan];
    const [showManageModal, setShowManageModal] = useState(false);

    const subscriberList = form.subscriberSettings.SubscriberList;
    const subscribers = subscriberList.data || [];
    const total = subscriberList.total || 0;
    const active = subscriberList.active || 0;
    const unsubscribed = subscriberList.unsubscribed || 0;

    const isSubscribeEnabled = limits?.showSubscribers;

    const columns = [
        { key: 'email', label: 'Email', sortable: true },
        { key: 'subscribedOn', label: 'Subscribed On', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
    ];

    const handleManageSettings = (data: SubscriberDataTypes['subscriberSettings']) => {
        setForm((prev) => ({
            ...prev,
            subscriberSettings: {
                ...prev.subscriberSettings,
                subscriberSettings: data,
            },
        }));
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
                        <button className="btn-primary" disabled={!isSubscribeEnabled}>
                            Send Email
                        </button>
                        <button
                            className="btn-secondary gap-2"
                            disabled={!isSubscribeEnabled}
                            onClick={() => setShowManageModal(true)}
                        >
                            <Settings size={16} />
                            Manage Settings
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
                        {subscribers.length > 0 ? (
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
                    initialData={form.subscriberSettings.subscriberSettings}
                />
            )}
        </div>
    );
}
