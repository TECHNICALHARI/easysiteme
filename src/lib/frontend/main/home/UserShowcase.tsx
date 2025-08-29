'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/main.module.css';

type LayoutType = 'bio' | 'website';

export type FeaturedUser = {
  username: string;
  fullName: string;
  title?: string;
  avatar?: string;
  bannerImage?: string;
  tags?: string[];
  layoutType?: LayoutType;
  customDomain?: string;
};

function publicUrl(u: FeaturedUser) {
  if (u.customDomain && /^https?:\/\//i.test(u.customDomain)) return u.customDomain;
  if (u.customDomain && !/^https?:\/\//i.test(u.customDomain)) return `https://${u.customDomain}`;
  return `https://${u.username}.myeasypage.com`;
}

function smallLine(u: FeaturedUser) {
  return u.title?.trim() || u.tags?.[0] || `@${u.username}`;
}

function pillText(u: FeaturedUser) {
  return (u.layoutType === 'website' ? 'Website' : 'Bio');
}

export default function UserShowcase() {
  const [items, setItems] = useState<FeaturedUser[] | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/public/featured', { cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const data: FeaturedUser[] = await res.json();
        if (!ignore) setItems(data?.length ? data : []);
      } catch {
        // optional: fallback curated examples till you wire the API
        if (!ignore) {
          setItems([
            {
              username: 'raj',
              fullName: 'Raj Verma',
              title: 'Freelance Developer',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/571402977de4c6c762df1f903668d7f7.jpeg',
              tags: ['freelancer', 'developer'],
              layoutType: 'website',
            },
            {
              username: 'aisha',
              fullName: 'Aisha Khan',
              title: 'Artist & Shop',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/20655a3b5329a87b9862d05d774502c8.jpeg',
              tags: ['artist'],
              layoutType: 'bio',
            },
            {
              username: 'startupdeck',
              fullName: 'StartupDeck',
              title: 'Product Landing',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/20655a3b5329a87b9862d05d774502c8.jpeg',
              tags: ['startup'],
              layoutType: 'website',
            },
            {
              username: 'reelsbyzoe',
              fullName: 'Zoe',
              title: 'Creator / Reels',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/571402977de4c6c762df1f903668d7f7.jpeg',
              tags: ['creator'],
              layoutType: 'bio',
            },
            {
              username: 'techhub',
              fullName: 'Tech Hub',
              title: 'Tech Blog',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/20655a3b5329a87b9862d05d774502c8.jpeg',
              tags: ['blog'],
              layoutType: 'website',
            },
            {
              username: 'chefamy',
              fullName: 'Chef Amy',
              title: 'Recipes & Videos',
              avatar: 'https://patientportalapi.akosmd.in/assets/patient/2025/fcab01f1b13fc6d8095431d56da4aabd.png',
              bannerImage: 'https://patientportalapi.akosmd.in/assets/patient/2025/571402977de4c6c762df1f903668d7f7.jpeg',
              tags: ['food'],
              layoutType: 'bio',
            },
          ]);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const loop = useMemo(() => (items ? [...items, ...items] : []), [items]);

  return (
    <section id="examples" className="section" aria-labelledby="examples-title">
      <div className="container-fluid">
        <div className={styles.blockHead}>
          <h2 id="examples-title" className="section-title">Loved by makers</h2>
          <p className="section-subtitle">
            From bio links to full websites — freelancers, creators, startups, and small businesses
            use myeasypage to launch polished online profiles in minutes.
          </p>
        </div>

        <div className={styles.userCarousel} aria-label="User site examples">
          <motion.div
            className={styles.userTrack}
            animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={reduceMotion ? undefined : { ease: 'linear', duration: 25, repeat: Infinity }}
          >
            {loop.map((u, i) => {
              const href = publicUrl(u);
              const bg = u.bannerImage || u.avatar || '';
              return (
                <Link
                  key={`${u.username}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.userCard} ${styles.userCardFull}`}
                  aria-label={`Open ${u.fullName} site`}
                >
                  {bg ? (
                    <Image
                      src={bg}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 260px, 320px"
                      className={styles.userBgImg}
                      priority={i < 4}
                    />
                  ) : (
                    <div className={styles.userBgFallback} aria-hidden="true" />
                  )}

                  <div className={styles.userOverlay} aria-hidden="true" />

                  <div className={styles.userBottom}>
                    <div className={styles.userName}>{u.fullName}</div>
                    <div className={styles.userSub}>
                      <span className={styles.userSubText}>{smallLine(u)}</span>
                      <span className={styles.userPill}>{pillText(u)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
