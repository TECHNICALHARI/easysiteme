'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import { Link2, Share2, Sparkles, UploadCloud, LogOut, User as UserIcon, Key } from 'lucide-react';
import Container from './Container';
import Logo from '../../common/Logo';
import ShareModal from '@/lib/frontend/singlepage/components/ShareModal';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { publishAdminForm } from '../../api/services';
import Link from 'next/link';
import { useUser } from '@/lib/frontend/context/UserContext';
import ConfirmModal from '@/lib/frontend/common/ConfirmModal';
import { useRouter } from 'next/navigation';

function getPublicUrl(username?: string, customDomain?: string) {
  if (!username && !customDomain) return '';
  if (customDomain) return `https://${customDomain}`;
  return `https://${username}.myeasypage.com`;
}

export default function AdminHeader() {
  const { form } = useAdminForm();
  const [openShare, setOpenShare] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const { logout } = useUser();
  const router = useRouter();

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
    } catch {}
  };

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout({ callServer: true });
      setConfirmLogoutOpen(false);
      setLogoutLoading(false);
    } catch (err: any) {
      setLogoutLoading(false);
      showToast(err?.message || 'Logout failed', 'error');
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerContent}>
            <Link href="/admin" className={styles.logo} aria-label="myeasypage admin home">
              <Logo />
            </Link>

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
                onClick={() => router.push('/pricing')}
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

              <div className={styles.headerMenu} ref={menuRef}>
                <button
                  className={`btn-primary ${styles.headerMenuButton}`}
                  onClick={() => setMenuOpen((s) => !s)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <UserIcon size={18} />
                  <span>My Account</span>
                </button>

                {menuOpen && (
                  <div className={styles.headerDropdown} role="menu" aria-label="User menu">
                    {/* <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        router.push('/admin/profile');
                      }}
                    >
                      <UserIcon size={16} /> <span>Profile</span>
                    </button> */}

                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        router.push('/admin/change-password');
                      }}
                    >
                      <Key size={16} /> <span>Change Password</span>
                    </button>

                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        handleShare();
                      }}
                    >
                      <Share2 size={16} /> <span>Share</span>
                    </button>

                    <div className={styles.dropdownDivider} />

                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmLogoutOpen(true);
                      }}
                    >
                      <LogOut size={16} /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>

        <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={publicUrl} />
      </header>

      <ConfirmModal
        open={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        loading={logoutLoading}
      />
    </>
  );
}


