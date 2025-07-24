'use client';

import styles from '@/styles/admin.module.css';
import { Link2, Share2, Sparkles, UploadCloud } from 'lucide-react';
import Container from './Container';
import Logo from '../../common/Logo';

export default function AdminHeader() {
  const handlePublish = () => {
    console.log('Publishing all changes...');
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Logo />
          </div>

          <div className={styles.headerRight}>
            <button className={`btn-primary shadow-md ${styles.publishChangesButton}`} onClick={handlePublish}>
              <UploadCloud size={16} className={styles.icon} />
              Publish Changes
            </button>

            <button className={`btn-primary shadow-md ${styles.upgradeButton}`}>
              <Sparkles size={16} className={styles.icon} />
              Upgrade
            </button>

            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
              <Link2 size={16} className={styles.icon} />
              yourname.bio.link
            </a>

            <button className={styles.shareButton}>
              <Share2 size={16} className={styles.icon} />
              Share
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
