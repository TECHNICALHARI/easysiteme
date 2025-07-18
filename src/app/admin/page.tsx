'use client';

import { useState } from 'react';
import styles from '@/styles/admin.module.css';
import previewStyles from '@/styles/preview.module.css';
import { useAutoSave } from '@/lib/frontend/hooks/useAutoSave';
import MobilePreview from '@/lib/frontend/admin/components/MobilePreview';
import { FormData } from '@/lib/frontend/types/form';
import AllTabs from '@/lib/frontend/admin/components/AllTabs';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';

export default function Dashboard() {
    const [form, setForm] = useState<FormData>({
        fullName: '',
        username: '',
        title: '',
        bio: '',
        avatar: '',
        links: [],
        headers: [],
        gallery: [],
        youtube: '',
        instagram: '',
        calendly: '',
        posts: [],
        metaTitle: '',
        metaDescription: '',
        nsfwWarning: false,
        preferredLink: 'primary',
        customDomain: '',
        emojiLink: '',
        gaId: '',
        theme: 'theme-default',
    });
    useAutoSave(form);
    return (
        <div className={styles.dashboardWrapper}>
            <AdminHeader />
            <Container>
                <div className={styles.dashboardLayout}>
                    <div className={styles.mobilePreview}>
                        <div className={styles.phoneFrame}>
                            <MobilePreview form={form} />
                        </div>
                    </div>
                    <div className={styles.pageContainer}>
                        <div className={styles.dashboard_mainRapper}>
                            <AllTabs form={form} setForm={setForm} />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
