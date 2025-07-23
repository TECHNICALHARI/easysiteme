'use client';

import { Lock } from 'lucide-react';
import styles from '@/styles/admin.module.css';

type LockedOverlayProps = {
  enabled: boolean;
  limitReached?: boolean;
  upgradeUrl?: string;
  mode?: 'overlay' | 'notice';
  children: React.ReactNode;
};

const LockedOverlay: React.FC<LockedOverlayProps> = ({
  enabled,
  limitReached = false,
  upgradeUrl = '/pricing',
  mode = 'overlay',
  children,
}) => {
  const isLocked = !enabled || limitReached;

  if (!isLocked) return <>{children}</>;

  const message = limitReached
    ? 'You’ve reached the limit for your plan.'
    : 'This is a Premium feature.';

  if (mode === 'notice') {
    return (
      <div>
        {children}
        <div className={styles.noticeBox}>
          <div className={styles.noticeLeft}>
            <Lock size={16} className={styles.noticeIcon} />
            <span>{message}</span>
          </div>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = upgradeUrl)}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lockedWrapper}>
      <div className={styles.lockedContent}>
        <Lock size={20} className={styles.lockIcon} />
        <p className={styles.lockText}>{message}</p>
        <button
          className="btn-secondary"
          onClick={() => (window.location.href = upgradeUrl)}
        >
          Upgrade Now
        </button>
      </div>
      <div className={styles.lockedOverlay} />
    </div>
  );
};

export default LockedOverlay;
