'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from '@/styles/admin.module.css';
import ToggleSwitch from '../../common/ToggleSwitch';

export default function ContactInfoSection({
    form,
    setForm,
}: {
    form: any;
    setForm: Dispatch<SetStateAction<any>>;
}) {
    return (
        <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
                <h4>Contact Info <span className="badge-pro">Pro</span></h4>
            </div>

            <input
                className="input"
                placeholder="Email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
                className="input mt-3"
                placeholder="Phone Number"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
                className="input mt-3"
                placeholder="Website (e.g. https://yourdomain.com)"
                value={form.website || ''}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
            />

            <input
                className="input mt-3"
                placeholder="WhatsApp Number (e.g. +15555555555)"
                value={form.whatsapp || ''}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">
                Make sure your website includes <code>https://</code> and WhatsApp is in international format.
            </p>
            <div className='mt-4'>
                <ToggleSwitch
                    label="Show Contact Form on your profile"
                    checked={form.showContactForm || false}
                    onChange={(checked) => setForm({ ...form, showContactForm: checked })}
                    isPro
                    // disabled={!limits.contactForm}
                    description="Visitors can message you directly from your profile page."
                />
            </div>
        </div>
    );
}
