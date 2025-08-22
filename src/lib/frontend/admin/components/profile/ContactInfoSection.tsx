'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from '@/styles/admin.module.css';
import ToggleSwitch from '../../../common/ToggleSwitch';
import LockedOverlay from '../../layout/LockedOverlay';

export default function ContactInfoSection({
  form,
  setForm,
  canUseContact,
}: {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  canUseContact: boolean;
}) {
  const disabled = !canUseContact;

  return (
    <div className={styles.sectionMain}>
      <div className={styles.SecHeadAndBtn}>
        <h4 className={styles.sectionLabel}>Contact <span className="badge-pro">Pro</span></h4>
      </div>

      <LockedOverlay enabled={canUseContact} mode="notice">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Email"
            disabled={disabled}
            value={form.profile.email || ''}
            onChange={(e) => setForm((p: any) => ({ ...p, profile: { ...p.profile, email: e.target.value } }))}
          />
          <input
            className="input"
            placeholder="Phone Number"
            disabled={disabled}
            value={form.profile.phone || ''}
            onChange={(e) => setForm((p: any) => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))}
          />
          <input
            className="input"
            placeholder="Website (e.g. https://yourdomain.com)"
            disabled={disabled}
            value={form.profile.website || ''}
            onChange={(e) => setForm((p: any) => ({ ...p, profile: { ...p.profile, website: e.target.value } }))}
          />
          <input
            className="input"
            placeholder="WhatsApp Number (e.g. +15555555555)"
            disabled={disabled}
            value={form.profile.whatsapp || ''}
            onChange={(e) => setForm((p: any) => ({ ...p, profile: { ...p.profile, whatsapp: e.target.value } }))}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Ensure your website has https:// and WhatsApp is in international format.
        </p>

        <div className="mt-4">
          <ToggleSwitch
            label="Enable Contact Form"
            checked={!!form.profile.showContactForm}
            onChange={(checked) =>
              setForm((p: any) => ({ ...p, profile: { ...p.profile, showContactForm: checked } }))
            }
            isPro
            description="Visitors can message you directly from your page."
            className={disabled ? 'pointer-events-none opacity-60' : ''}
          />
        </div>
      </LockedOverlay>
    </div>
  );
}
