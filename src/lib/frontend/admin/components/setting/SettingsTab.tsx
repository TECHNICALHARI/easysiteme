'use client';

import { useState } from 'react';
import { X, Check, Settings as SettingsIcon } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { PLAN_FEATURES, PlanType } from '@/config/PLAN_FEATURES';
import DomainSetupModal from './DomainSetupModal';
import LockedOverlay from '../../layout/LockedOverlay';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { debounceCheckDomain, validateSubdomain } from '@/lib/frontend/utils/checkdomain';
import { checkSubdomainApi, changeSubdomainApi } from '@/lib/frontend/api/services';

const MAX_SEO_TITLE = 60;
const MAX_SEO_DESCRIPTION = 160;
const MAX_KEYWORDS = 10;

export default function SettingsTab() {
    const { profileDesign, setProfileDesign, settings, setSettings, plan } = useAdminForm() as any;
    const profile = profileDesign?.profile || {};
    const seo = settings?.seo || {};
    const limits = PLAN_FEATURES[plan as PlanType];
    const { showToast } = useToast();

    const [showDomainModal, setShowDomainModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainAvailable, setSubdomainAvailable] = useState<null | boolean>(null);
    const [subdomainError, setSubdomainError] = useState<string | null>(null);
    const [changing, setChanging] = useState(false);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let inputValue: string | boolean = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        if (name === 'metaTitle') inputValue = (value as string).slice(0, MAX_SEO_TITLE);
        if (name === 'metaDescription') inputValue = (value as string).slice(0, MAX_SEO_DESCRIPTION);
        if (['canonicalUrl', 'ogImage', 'twitterImage'].includes(name)) {
            if (value && !isValidUrl(value)) {
                setErrors((prev) => ({ ...prev, [name]: 'Please enter a valid URL (must include https://)' }));
            } else {
                setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy[name];
                    return copy;
                });
            }
        }
        setSettings((prev: any) => ({ ...prev, seo: { ...prev.seo, [name]: inputValue } }));
    };

    const handleProfileFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
    };

    const handleSubdomainChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        setSettings((prev: any) => ({ ...prev, subdomain: val }));
        const cleanVal = val.replace(/[^a-z0-9-]/gi, '').toLowerCase();
        const err = validateSubdomain(cleanVal);
        setSubdomainError(err);
        setSubdomainAvailable(null);
        if (!err && cleanVal) debounceCheckDomain(cleanVal, checkSubdomain, 500);
    };

    const checkSubdomain = async (name: string) => {
        if (!name) {
            setSubdomainAvailable(null);
            return;
        }
        setCheckingSubdomain(true);
        try {
            const res = await checkSubdomainApi(name);
            if (res?.success && typeof res.data?.available !== 'undefined') {
                setSubdomainAvailable(Boolean(res.data.available));
            } else {
                setSubdomainAvailable(null);
            }
        } catch {
            setSubdomainAvailable(null);
        } finally {
            setCheckingSubdomain(false);
        }
    };

    const handleChangeSubdomainClick = async () => {
        const name = (settings.subdomain || '').replace(/[^a-z0-9-]/gi, '').toLowerCase();
        const err = validateSubdomain(name);
        if (err) {
            setSubdomainError(err);
            showToast(err, 'error');
            return;
        }
        if (!name) {
            showToast('Enter a subdomain first', 'error');
            return;
        }
        setChanging(true);
        try {
            const res = await changeSubdomainApi(name);
            if (res?.success) {
                setSettings((prev: any) => ({ ...prev, subdomain: name }));
                showToast('Subdomain updated', 'success');
            } else {
                showToast(res?.message || 'Failed to change subdomain', 'error');
            }
        } catch (err: any) {
            showToast(err?.message || 'Failed to change subdomain', 'error');
        } finally {
            setChanging(false);
        }
    };

    const handleDomainSave = (domain: string) => {
        setSettings((prev: any) => ({ ...prev, customDomain: domain }));
        setShowDomainModal(false);
        showToast('Custom domain saved', 'success');
    };

    const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = (e.currentTarget.value || '').trim();
            if (!val) return;
            if (seo.metaKeywords?.includes(val)) return;
            if ((seo.metaKeywords?.length || 0) >= MAX_KEYWORDS) return;
            setSettings((prev: any) => ({ ...prev, seo: { ...prev.seo, metaKeywords: [...(prev.seo?.metaKeywords || []), val] } }));
            e.currentTarget.value = '';
        }
    };

    const handleRemoveKeyword = (index: number) => {
        const updated = (seo.metaKeywords || []).filter((_k: any, i: number) => i !== index);
        setSettings((prev: any) => ({ ...prev, seo: { ...prev.seo, metaKeywords: updated } }));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Settings</h3>
                <p>Manage your domain, SEO, analytics, and other preferences.</p>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4 className={styles.sectionLabel}>Subdomain</h4>
                </div>
                <div className="custumGroupInput">
                    <label htmlFor="subdomain" className="labelText">Your Public Subdomain</label>
                    <div className="inputGroup relative">
                        <input
                            id="subdomain"
                            className="input inputWithIcon pr-36"
                            type="text"
                            name="subdomain"
                            placeholder="yourname"
                            value={settings.subdomain || ''}
                            onChange={handleSubdomainChangeInput}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {settings.subdomain &&
                                (subdomainError ? (
                                    <X size={18} className="text-red-500" />
                                ) : subdomainAvailable ? (
                                    <Check size={18} className="text-green-600" />
                                ) : subdomainAvailable === false ? (
                                    <X size={18} className="text-red-500" />
                                ) : checkingSubdomain ? (
                                    <span className="text-gray-400 text-xs">Checking...</span>
                                ) : null)}
                            <button
                                type="button"
                                className="btn-secondary text-sm"
                                onClick={handleChangeSubdomainClick}
                                disabled={changing || !settings.subdomain}
                                title="Change subdomain"
                            >
                                <SettingsIcon size={14} /> Change
                            </button>
                        </div>
                    </div>
                    {errors.subdomain && <p className="text-red-500 text-sm mb-2">{errors.subdomain}</p>}

                    {settings.subdomain && !subdomainError && (
                        <div className={styles.previewBox}>
                            <span className={`${styles.previewUrl} ${subdomainAvailable ? 'text-green-600' : subdomainAvailable === false ? 'text-red-500' : ''}`}>
                                https://{settings.subdomain}.myeasypage.com
                            </span>
                            <span className={styles.previewNote}>
                                {checkingSubdomain
                                    ? 'Checking availability...'
                                    : subdomainAvailable === null
                                        ? 'Enter a unique subdomain using letters, numbers or hyphens'
                                        : subdomainAvailable
                                            ? 'Subdomain is available'
                                            : 'Subdomain is taken'}
                            </span>
                        </div>
                    )}
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
                            value={seo.metaTitle || ''}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {(seo.metaTitle || '').length}/{MAX_SEO_TITLE}
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
                            value={seo.metaDescription || ''}
                            onChange={handleSeoChange}
                        />
                        <div className="text-right text-xs text-muted mt-1">
                            {(seo.metaDescription || '').length}/{MAX_SEO_DESCRIPTION}
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
                                    onChange={(e) => setSettings((prev: any) => ({ ...prev, seo: { ...prev.seo, noIndex: (e.target as HTMLInputElement).checked } }))}
                                />
                                <span>No Index (hide from search engines)</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="noFollow"
                                    checked={seo.noFollow || false}
                                    onChange={(e) => setSettings((prev: any) => ({ ...prev, seo: { ...prev.seo, noFollow: (e.target as HTMLInputElement).checked } }))}
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
