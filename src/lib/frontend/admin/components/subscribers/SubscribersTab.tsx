// SubscribersTab.tsx
'use client';

import { useRouter } from 'next/navigation';
import LockedOverlay from '../../layout/LockedOverlay';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import styles from "@/styles/admin.module.css";
import { Settings } from 'lucide-react';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import ManageSubscribersModal from './ManageSubscribersModal';
import { useState } from 'react';
import { SubscriberDataTypes } from '@/lib/frontend/types/form';

const SubscribersTab = () => {
    const router = useRouter();
    const { form, setForm } = useAdminForm();
    const plan = form?.plan;
    const limits = PLAN_FEATURES[plan];

    const [showManageModal, setShowManageModal] = useState(false);


    const subscribersData = [
        { email: 'user1@example.com', subscribedOn: '2023-01-15', status: 'Active' },
        { email: 'user2@example.com', subscribedOn: '2023-02-20', status: 'Active' },
        { email: 'user3@example.com', subscribedOn: '2023-03-10', status: 'Unsubscribed' },
        { email: 'user4@example.com', subscribedOn: '2023-04-05', status: 'Active' },
        { email: 'user5@example.com', subscribedOn: '2023-05-25', status: 'Unsubscribed' },
    ];

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

    const isEnableSubscribe = limits?.showSubscribers
    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Manage Your Subscribers</h3>
                <p>View and update your subscriber list, track their status, and send communications.</p>
            </div>
            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Your Subscribers <span className="badge-pro">Pro</span></h4>
                    <div className='flex gap-4'>
                        <button
                            className="btn-primary"
                            disabled={!isEnableSubscribe}
                        >
                            Send Email
                        </button>
                        <button
                            className="btn-secondary gap-2"
                            disabled={!isEnableSubscribe}
                            onClick={() => setShowManageModal(true)} // Open the manage modal
                        >
                            <Settings size={16} />
                            Manage Settings
                        </button>
                    </div>
                </div>

                <LockedOverlay
                    enabled={isEnableSubscribe}
                    mode="overlay"
                >
                    <div className='grid md:grid-cols-3 md:gap-x-6 gap-y-6'>
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Total</h4>
                            <p>30</p>
                        </div>
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Active</h4>
                            <p>26</p>
                        </div>
                        <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
                            <h4>Unsubscribed</h4>
                            <p>4</p>
                        </div>
                    </div>
                    <div className={styles.SubsTableMain}>
                        <h4>Subscriber List</h4>
                        <AdminTable columns={columns} data={subscribersData} />
                    </div>
                </LockedOverlay>
            </div>

            {showManageModal && (
                <ManageSubscribersModal
                    onClose={() => setShowManageModal(false)}
                    onSave={handleManageSettings}
                    initialData={form.subscriberSettings.subscriberSettings}
                />
            )}
        </div>
    );
};

export default SubscribersTab;
