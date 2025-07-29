'use client';

import { useCallback, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import DomainSetupModal from './DomainSetupModal';
import LockedOverlay from '../../layout/LockedOverlay';

const MAX_SEO_TITLE = 60;
const MAX_SEO_DESCRIPTION = 160;

export default function SettingsTab() {
    const { form, setForm } = useAdminForm();
    const { profile, settings, seo, plan } = form;
    const [showDomainModal, setShowDomainModal] = useState(false);
    const limits = PLAN_FEATURES[plan];

    const handleProfileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [name]: value,
                },
            }));
        },
        [setForm]
    );

    const handleSettingsChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value, type } = e.target;
            const inputValue = type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value;

            setForm((prev) => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [name]: inputValue,
                },
            }));
        },
        [setForm]
    );

    const handleSeoChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            const trimmed =
                name === 'seoTitle'
                    ? value.slice(0, MAX_SEO_TITLE)
                    : value.slice(0, MAX_SEO_DESCRIPTION);

            setForm((prev) => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    [name === 'seoTitle' ? 'metaTitle' : 'metaDescription']: trimmed,
                },
            }));
        },
        [setForm]
    );

    const handleDomainSave = (domain: string) => {
        setForm((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                customDomain: domain,
            },
        }));
        setShowDomainModal(false);
    };

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Settings</h3>
                <p>Manage domain preferences, SEO metadata, and other settings.</p>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Username</h4>
                </div>
                <div className="custumGroupInput">
                    <h3 className="labelText">Your Public Username</h3>
                    <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="yourname"
                        value={profile.username}
                        onChange={handleProfileChange}
                    />
                </div>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Preferred Link Format</h4>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="preferredLink"
                            value="primary"
                            checked={settings.preferredLink === 'primary'}
                            onChange={handleSettingsChange}
                        />
                        <span>easysiteme.com/username</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="preferredLink"
                            value="custom"
                            checked={settings.preferredLink === 'custom'}
                            onChange={handleSettingsChange}
                        />
                        <span>username.easysiteme.com</span>
                    </label>
                </div>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Custom Domain <span className="badge-pro">Pro</span></h4>
                    <button
                        className="btn-secondary text-sm"
                        onClick={() => setShowDomainModal(true)}
                        disabled={!limits?.customDomain}
                    >
                        Set Up Domain
                    </button>
                </div>
                <LockedOverlay enabled={limits?.customDomain} mode="overlay">
                    <div className="custumGroupInput">
                        <h3 className="labelText">Current Domain</h3>
                        <input
                            className="input"
                            type="text"
                            value={settings.customDomain || 'Not configured'}
                            disabled
                        />
                    </div>
                </LockedOverlay>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Google Analytics</h4>
                </div>
                <div className="custumGroupInput">
                    <h3 className="labelText">Google Analytics ID</h3>
                    <input
                        className="input"
                        type="text"
                        name="gaId"
                        placeholder="UA-XXXXXXX-X"
                        value={settings.gaId || ''}
                        onChange={handleSettingsChange}
                    />
                </div>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>SEO Settings</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <div className="custumGroupInput">
                        <h3 className="labelText">Page Title</h3>
                        <input
                            className="input"
                            type="text"
                            name="seoTitle"
                            placeholder={`Max ${MAX_SEO_TITLE} characters`}
                            value={seo.metaTitle}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {seo.metaTitle.length}/{MAX_SEO_TITLE}
                        </div>
                    </div>
                    <div className="custumGroupInput">
                        <h3 className="labelText">Meta Description</h3>
                        <textarea
                            className="input"
                            name="seoDescription"
                            rows={3}
                            placeholder={`Max ${MAX_SEO_DESCRIPTION} characters`}
                            value={seo.metaDescription}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {seo.metaDescription.length}/{MAX_SEO_DESCRIPTION}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Other Preferences</h4>
                </div>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name="nsfwWarning"
                        checked={settings.nsfwWarning}
                        onChange={handleSettingsChange}
                    />
                    <span>Show NSFW content warning</span>
                </label>
            </div>

            {showDomainModal && (
                <DomainSetupModal
                    onClose={() => setShowDomainModal(false)}
                    onSave={handleDomainSave}
                    initialDomain={settings.customDomain}
                />
            )}
        </div>
    );
}
