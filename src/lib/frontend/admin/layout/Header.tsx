'use client';

import { useMemo, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { Link2, Share2, Sparkles, UploadCloud } from 'lucide-react';
import Container from './Container';
import Logo from '../../common/Logo';
import ShareModal from '@/lib/frontend/singlepage/components/ShareModal';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { publishAdminForm } from '../../api/services';

function getPublicUrl(username?: string, customDomain?: string) {
  if (!username && !customDomain) return '';
  if (customDomain) return `https://${customDomain}`;
  return `https://${username}.myeasypage.com`;
}

export default function AdminHeader() {
  const { form } = useAdminForm();
  const [openShare, setOpenShare] = useState(false);
  const { showToast } = useToast();

  const publicUrl = useMemo(
    () => getPublicUrl(form?.profile?.username, form?.settings?.customDomain),
    [form?.profile?.username, form?.settings?.customDomain]
  );

  const handlePublish = async () => {
    try {
      const res = await publishAdminForm(form);
      showToast(res.message || 'Published', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Publish failed', 'error');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my myeasypage',
          text: 'Here is my myeasypage link:',
          url: publicUrl,
        });
      } else {
        setOpenShare(true);
      }
    } catch { }
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Logo />
          </div>

          <div className={styles.headerRight}>
            <button
              className={`btn-primary shadow-md ${styles.publishChangesButton}`}
              onClick={handlePublish}
              aria-label="Publish Changes"
              title="Publish Changes"
            >
              <UploadCloud size={16} className={styles.icon} />
              <span className={styles.btnLabel}>Publish Changes</span>
            </button>

            <button
              className={`btn-primary shadow-md ${styles.upgradeButton}`}
              aria-label="Upgrade"
              title="Upgrade"
            >
              <Sparkles size={16} className={styles.icon} />
              <span className={styles.btnLabel}>Upgrade</span>
            </button>

            <a
              href={publicUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${styles.truncateLink}`}
              aria-label="Open your public link"
              title={publicUrl || 'Public link'}
            >
              <Link2 size={16} className={styles.icon} />
              <span className={styles.btnLabel}>
                {form?.settings?.customDomain ||
                  (form?.profile?.username ? `${form.profile.username}.myeasypage.com` : 'yourname.myeasypage.com')}
              </span>
            </a>

            <button
              className={styles.shareButton}
              aria-label="Share"
              title="Share"
              onClick={handleShare}
            >
              <Share2 size={16} className={styles.icon} />
              <span className={styles.btnLabel}>Share</span>
            </button>
          </div>
        </div>
      </Container>

      <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={publicUrl} />
    </header>
  );
}
