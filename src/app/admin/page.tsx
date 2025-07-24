'use client';

import { useState } from 'react';
import styles from '@/styles/admin.module.css';
import { useAutoSave } from '@/lib/frontend/hooks/useAutoSave';
import MobilePreview from '@/lib/frontend/admin/components/MobilePreview';
import { FormData } from '@/lib/frontend/types/form';
import AllTabs from '@/lib/frontend/admin/components/AllTabs';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';

export default function Dashboard() {
    const [form, setForm] = useState<FormData>({
        profile: {
            fullName: '',
            username: '',
            title: '',
            bio: '',
            avatar: '',
            bannerImage: '',
            about: '',
            headers: [],
            links: [],
            embeds: [],
            testimonials: [],
            faqs: [],
            services: [],
            featured: [],
            tags: [],
            fullAddress: '',
            latitude: '',
            longitude: '',
            resumeUrl: '',
        },
        design: {
            theme: 'theme-default',
            emojiLink: '',
        },
        seo: {
            metaTitle: '',
            metaDescription: '',
        },
        settings: {
            nsfwWarning: false,
            preferredLink: 'primary',
            customDomain: '',
            gaId: '',
        },
        socials: {
            youtube: '',
            instagram: '',
            calendly: '',
        },
        posts: {
            posts: [],
        },
    });

    useAutoSave(form);

    console.log(form, "form")
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
