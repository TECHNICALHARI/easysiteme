'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/superadmin.module.css';

const RichTextEditor = dynamic(
  () => import('@/lib/frontend/common/RichTextEditor'),
  { ssr: false }
);

export default function SuperAdminSettingsPage() {
  const [form, setForm] = useState({
    appName: 'OnePage Builder',
    logo: '',
    primaryColor: '#4f46e5',
    supportEmail: 'support@onepage.com',
    helpCenter: 'https://onepage.com/help',
    seoTitle: 'Build beautiful bio links | OnePage',
    seoDescription: 'OnePage helps you create powerful personal bio link websites with zero code.',
    emailFromName: 'OnePage Team',
    emailFromAddress: 'noreply@onepage.com',
    emailFooter: 'You’re receiving this because you signed up at OnePage.',
    footerText: 'Made with ❤️ by OnePage',
    copyright: '© 2025 OnePage Technologies Pvt. Ltd.',
    facebook: '',
    twitter: '',
    linkedin: '',
    customJs: '',
    maintenanceMode: false,
    maintenanceMessage: 'We’re upgrading our servers. Please check back soon.',
    termsHtml: '',
    privacyHtml: '',
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('✅ Settings saved:', form);
    alert('All settings have been saved.');
  };

  return (
    <div className={styles.screenWrapper}>
      <h2 className={styles.screenTitle}>Platform Settings</h2>

      <div className="grid md:grid-cols-2 gap-8 mt-6">

        {/* Branding */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Branding</h3>
          <label className={styles.label}>App Name</label>
          <input className={styles.input} value={form.appName} onChange={(e) => handleChange('appName', e.target.value)} />
          <label className={styles.label}>Logo</label>
          <input type="file" onChange={handleFileUpload} />
          {form.logo && <img src={form.logo} alt="Logo" className="mt-3 rounded-md w-20 border" />}
        </div>

        {/* Theme Color */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Theme Color</h3>
          <label className={styles.label}>Primary Color</label>
          <input type="color" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-16 h-10 rounded cursor-pointer border-none" />
        </div>

        {/* Contact Info */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Support</h3>
          <label className={styles.label}>Support Email</label>
          <input className={styles.input} value={form.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} />
          <label className={styles.label}>Help Center Link</label>
          <input className={styles.input} value={form.helpCenter} onChange={(e) => handleChange('helpCenter', e.target.value)} />
        </div>

        {/* SEO */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>SEO Defaults</h3>
          <label className={styles.label}>Default SEO Title</label>
          <input className={styles.input} value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} />
          <label className={styles.label}>SEO Description</label>
          <textarea className={styles.input} rows={3} value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} />
        </div>

        {/* Email Settings */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>System Email Settings</h3>
          <label className={styles.label}>From Name</label>
          <input className={styles.input} value={form.emailFromName} onChange={(e) => handleChange('emailFromName', e.target.value)} />
          <label className={styles.label}>From Email Address</label>
          <input className={styles.input} value={form.emailFromAddress} onChange={(e) => handleChange('emailFromAddress', e.target.value)} />
          <label className={styles.label}>Footer Text</label>
          <input className={styles.input} value={form.emailFooter} onChange={(e) => handleChange('emailFooter', e.target.value)} />
        </div>

        {/* Footer + Social */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Footer & Social Links</h3>
          <label className={styles.label}>Footer Text</label>
          <input className={styles.input} value={form.footerText} onChange={(e) => handleChange('footerText', e.target.value)} />
          <label className={styles.label}>Copyright</label>
          <input className={styles.input} value={form.copyright} onChange={(e) => handleChange('copyright', e.target.value)} />
          <label className={styles.label}>Facebook URL</label>
          <input className={styles.input} value={form.facebook} onChange={(e) => handleChange('facebook', e.target.value)} />
          <label className={styles.label}>Twitter URL</label>
          <input className={styles.input} value={form.twitter} onChange={(e) => handleChange('twitter', e.target.value)} />
          <label className={styles.label}>LinkedIn URL</label>
          <input className={styles.input} value={form.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
        </div>

        {/* Maintenance Mode */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Maintenance Mode</h3>
          <label className="flex items-center gap-3 text-sm mb-2">
            <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} className="w-4 h-4 accent-brand" />
            <span className="text-muted">Enable maintenance mode for users</span>
          </label>
          <textarea
            className={styles.input}
            rows={3}
            placeholder="Maintenance notice shown to users"
            value={form.maintenanceMessage}
            onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
          />
        </div>

        {/* Custom JS */}
        <div className={`${styles.card} md:col-span-2`}>
          <h3 className={styles.cardTitle}>Custom JS (Head Script)</h3>
          <textarea
            className={styles.input}
            placeholder="Paste your analytics or script tags"
            rows={4}
            value={form.customJs}
            onChange={(e) => handleChange('customJs', e.target.value)}
          />
        </div>

        {/* Terms & Privacy */}
        <div className="md:col-span-2 grid gap-6">
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Terms of Service</h3>
            <RichTextEditor
              value={form.termsHtml}
              onChange={(html) => handleChange('termsHtml', html)}
              placeholder="Write your terms here..."
            />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Privacy Policy</h3>
            <RichTextEditor
              value={form.privacyHtml}
              onChange={(html) => handleChange('privacyHtml', html)}
              placeholder="Write your privacy policy..."
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button className={styles.btnPrimary} onClick={handleSave}>Save All Settings</button>
      </div>
    </div>
  );
}
