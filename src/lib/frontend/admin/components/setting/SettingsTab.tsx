'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import DomainSetupModal from './DomainSetupModal';
import LockedOverlay from '../../layout/LockedOverlay';

const MAX_SEO_TITLE = 60;
const MAX_SEO_DESCRIPTION = 160;
const MAX_KEYWORDS = 10;

export default function SettingsTab() {
    const { form, setForm, plan } = useAdminForm();
    const { profile, settings, seo } = form;
    const limits = PLAN_FEATURES[plan];
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const finalValue = name === "username" ? value.toLowerCase() : value;
        setForm((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [name]: finalValue,
            },
        }));
    };


    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            settings: { ...prev.settings, [name]: type === 'checkbox' ? checked : value },
        }));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let inputValue: string | boolean = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (name === 'metaTitle') {
            inputValue = (value as string).slice(0, MAX_SEO_TITLE);
        }
        if (name === 'metaDescription') {
            inputValue = (value as string).slice(0, MAX_SEO_DESCRIPTION);
        }

        if (['canonicalUrl', 'ogImage', 'twitterImage'].includes(name)) {
            if (value && !isValidUrl(value)) {
                setErrors((prev) => ({ ...prev, [name]: 'Please enter a valid URL (must include https://)' }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }

        setForm((prev) => ({
            ...prev,
            seo: { ...prev.seo, [name]: inputValue },
        }));
    };

    const handleDomainSave = (domain: string) => {
        setForm((prev) => ({
            ...prev,
            settings: { ...prev.settings, customDomain: domain },
        }));
        setShowDomainModal(false);
    };

    const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = (e.currentTarget.value || '').trim();
            if (!val) return;
            if (seo.metaKeywords?.includes(val)) return;
            if ((seo.metaKeywords?.length || 0) >= MAX_KEYWORDS) return;

            setForm({
                ...form,
                seo: { ...seo, metaKeywords: [...(seo.metaKeywords || []), val] },
            });
            e.currentTarget.value = '';
        }
    };

    const handleRemoveKeyword = (index: number) => {
        const updated = (seo.metaKeywords || []).filter((_k, i) => i !== index);
        setForm({
            ...form,
            seo: { ...seo, metaKeywords: updated },
        });
    };

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Settings</h3>
                <p>Manage your domain, SEO, analytics, and other preferences.</p>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Username</h4>
                </div>
                <div className="custumGroupInput">
                    <label htmlFor="username" className="labelText">Your Public Username</label>
                    <input
                        id="username"
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
                <div className="flex flex-col lg:flex-row gap-4">
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="preferredLink"
                            value="primary"
                            checked={settings.preferredLink === 'primary'}
                            onChange={handleSettingsChange}
                        />
                        <span>myeasypage.com/username</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="preferredLink"
                            value="custom"
                            checked={settings.preferredLink === 'custom'}
                            onChange={handleSettingsChange}
                        />
                        <span>username.myeasypage.com</span>
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
                        <label htmlFor="customDomain" className="labelText">Current Domain</label>
                        <input
                            id="customDomain"
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
                    <label htmlFor="gaId" className="labelText">Google Analytics ID</label>
                    <input
                        id="gaId"
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
                <div className="grid grid-cols-1 gap-3">
                    <div className="custumGroupInput">
                        <label htmlFor="metaTitle" className="labelText">Page Title</label>
                        <input
                            id="metaTitle"
                            className="input"
                            type="text"
                            name="metaTitle"
                            placeholder={`Max ${MAX_SEO_TITLE} characters`}
                            value={seo.metaTitle}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {seo.metaTitle.length}/{MAX_SEO_TITLE}
                        </div>
                    </div>

                    <div className="custumGroupInput">
                        <label htmlFor="metaDescription" className="labelText">Meta Description</label>
                        <textarea
                            id="metaDescription"
                            className="input"
                            name="metaDescription"
                            rows={3}
                            placeholder={`Max ${MAX_SEO_DESCRIPTION} characters`}
                            value={seo.metaDescription}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {seo.metaDescription.length}/{MAX_SEO_DESCRIPTION}
                        </div>
                    </div>

                    <LockedOverlay enabled={limits?.fullSEO} mode="overlay">
                        <div className="custumGroupInput">
                            <label htmlFor="metaKeywords" className="labelText">Meta Keywords</label>
                            <input
                                id="metaKeywords"
                                className="input"
                                type="text"
                                placeholder="Type keyword and press Enter"
                                onKeyDown={handleAddKeyword}
                                disabled={(seo.metaKeywords?.length || 0) >= MAX_KEYWORDS}
                            />
                            {seo.metaKeywords && seo.metaKeywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {seo.metaKeywords.map((tag: string, index: number) => (
                                        <div key={index} className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                                            {tag}
                                            <button
                                                type="button"
                                                className="ml-2 hover:text-red-600"
                                                onClick={() => handleRemoveKeyword(index)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {seo.metaKeywords && seo.metaKeywords.length >= MAX_KEYWORDS && (
                                <p className="text-xs text-red-500 mt-1">Maximum {MAX_KEYWORDS} keywords allowed</p>
                            )}
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="canonicalUrl" className="labelText">Canonical URL</label>
                            <input
                                id="canonicalUrl"
                                className={`input ${errors.canonicalUrl ? 'border-red-500' : ''}`}
                                type="text"
                                name="canonicalUrl"
                                placeholder="https://myeasypage.com/username"
                                value={seo.canonicalUrl || ''}
                                onChange={handleSeoChange}
                            />
                            {errors.canonicalUrl && <p className="text-xs text-red-500 mt-1">{errors.canonicalUrl}</p>}
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="ogTitle" className="labelText">Open Graph Title</label>
                            <input
                                id="ogTitle"
                                className="input"
                                type="text"
                                name="ogTitle"
                                placeholder="Social share title"
                                value={seo.ogTitle || ''}
                                onChange={handleSeoChange}
                            />
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="ogDescription" className="labelText">Open Graph Description</label>
                            <textarea
                                id="ogDescription"
                                className="input"
                                name="ogDescription"
                                rows={2}
                                placeholder="Social share description"
                                value={seo.ogDescription || ''}
                                onChange={handleSeoChange}
                            />
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="ogImage" className="labelText">Open Graph Image URL</label>
                            <input
                                id="ogImage"
                                className={`input ${errors.ogImage ? 'border-red-500' : ''}`}
                                type="text"
                                name="ogImage"
                                placeholder="https://example.com/og-image.jpg"
                                value={seo.ogImage || ''}
                                onChange={handleSeoChange}
                            />
                            {errors.ogImage && <p className="text-xs text-red-500 mt-1">{errors.ogImage}</p>}
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="twitterTitle" className="labelText">Twitter Title</label>
                            <input
                                id="twitterTitle"
                                className="input"
                                type="text"
                                name="twitterTitle"
                                placeholder="Twitter card title"
                                value={seo.twitterTitle || ''}
                                onChange={handleSeoChange}
                            />
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="twitterDescription" className="labelText">Twitter Description</label>
                            <textarea
                                id="twitterDescription"
                                className="input"
                                name="twitterDescription"
                                rows={2}
                                placeholder="Twitter card description"
                                value={seo.twitterDescription || ''}
                                onChange={handleSeoChange}
                            />
                        </div>

                        <div className="custumGroupInput">
                            <label htmlFor="twitterImage" className="labelText">Twitter Image URL</label>
                            <input
                                id="twitterImage"
                                className={`input ${errors.twitterImage ? 'border-red-500' : ''}`}
                                type="text"
                                name="twitterImage"
                                placeholder="https://example.com/twitter-image.jpg"
                                value={seo.twitterImage || ''}
                                onChange={handleSeoChange}
                            />
                            {errors.twitterImage && <p className="text-xs text-red-500 mt-1">{errors.twitterImage}</p>}
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="noIndex"
                                    checked={seo.noIndex || false}
                                    onChange={handleSeoChange as any}
                                />
                                <span>No Index (hide from search engines)</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="noFollow"
                                    checked={seo.noFollow || false}
                                    onChange={handleSeoChange as any}
                                />
                                <span>No Follow (don’t follow links on this page)</span>
                            </label>
                        </div>
                    </LockedOverlay>
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
