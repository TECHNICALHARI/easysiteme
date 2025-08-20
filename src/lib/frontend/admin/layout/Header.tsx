'use client';

import { useMemo, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { Link2, Share2, Sparkles, UploadCloud } from 'lucide-react';
import Container from './Container';
import Logo from '../../common/Logo';
import ShareModal from '@/lib/frontend/singlepage/components/ShareModal';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';

function getPublicUrl(username?: string, customDomain?: string) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  if (customDomain) return `https://${customDomain}`;
  if (username) return `${origin}/${username}`;
  return origin;
}

export default function AdminHeader() {
  const { form } = useAdminForm();
  const [openShare, setOpenShare] = useState(false);

  const publicUrl = useMemo(
    () => getPublicUrl(form?.profile?.username, form?.settings?.customDomain),
    [form?.profile?.username, form?.settings?.customDomain]
  );

  const handlePublish = () => {
    console.log('Publishing all changes...');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my OnePage',
          text: 'Here is my OnePage link:',
          url: publicUrl,
        });
      } else {
        setOpenShare(true);
      }
    } catch {
    }
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
                {form?.settings?.customDomain || `${form?.profile?.username || 'yourname'}.bio.link`}
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
