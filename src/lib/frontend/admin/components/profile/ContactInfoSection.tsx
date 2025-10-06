'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from '@/styles/admin.module.css';
import ToggleSwitch from '../../../common/ToggleSwitch';
import LockedOverlay from '../../layout/LockedOverlay';
import type { ProfileTabData } from '@/lib/frontend/types/form';

export default function ContactInfoSection({
  profile,
  setProfile,
  canUseContact,
}: {
  profile: ProfileTabData;
  setProfile: Dispatch<SetStateAction<ProfileTabData>>;
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
            value={profile.email || ''}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Phone Number"
            disabled={disabled}
            value={profile.phone || ''}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Website (e.g. https://yourdomain.com)"
            disabled={disabled}
            value={profile.website || ''}
            onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
          />
          <input
            className="input"
            placeholder="WhatsApp Number (e.g. +15555555555)"
            disabled={disabled}
            value={profile.whatsapp || ''}
            onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Ensure your website has https:// and WhatsApp is in international format.
        </p>

        <div className="mt-4">
          <ToggleSwitch
            label="Enable Contact Form"
            checked={!!profile.showContactForm}
            onChange={(checked) => setProfile((p) => ({ ...p, showContactForm: checked }))}
            isPro
            description="Visitors can message you directly from your page."
            className={disabled ? 'pointer-events-none opacity-60' : ''}
          />
        </div>
      </LockedOverlay>
    </div>
  );
}
