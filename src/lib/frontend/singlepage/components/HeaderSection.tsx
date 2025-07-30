'use client';

import styles from '@/styles/preview.module.css';
import { ProfileTabData } from '@/lib/frontend/types/form';

export default function HeaderSection({ profile }: { profile: ProfileTabData }) {
  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <section className={styles.profileSection}>
      {profile.bannerImage && (
        <div className={styles.bannerWrapper}>
          <img src={profile.bannerImage} alt="banner" className={styles.bannerImage} />
        </div>
      )}

      <div className={styles.profileInfo}>
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
        <h1 className={styles.avatarName}>{profile.fullName}</h1>
        {profile.title && <p className={styles.tagline}>{profile.title}</p>}
        {profile.about && (
          <div
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        )}
      </div>
    </section>
  );
}
