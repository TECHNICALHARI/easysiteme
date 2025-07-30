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
          <img src={profile.bannerImage} alt="Banner" className={styles.bannerImage} />
        </div>
      )}

      <div className={styles.profileInfo}>
        {profile.avatar ? (
          <img src={profile.avatar} alt="Avatar" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}

        <h1 className={styles.avatarName}>{profile.fullName}</h1>
        {profile.title && <p className={styles.tagline}>{profile.title}</p>}
        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

        {profile.tags &&profile.tags?.length > 0 && (
          <div className={styles.tagsWrapper}>
            {profile.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {profile.headers?.length > 0 && (
          <div className={styles.headersWrapper}>
            {profile.headers.map((h) => (
              <h2 key={h.id} className={styles.profileSubheader}>
                {h.title}
              </h2>
            ))}
          </div>
        )}

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
