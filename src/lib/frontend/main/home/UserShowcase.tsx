'use client';

import { motion } from 'framer-motion';
import { Globe, UserCheck, Image, Video } from 'lucide-react';
import styles from '@/styles/main.module.css';
import Link from 'next/link';

const users = [
  { name: '@raj', link: 'https://raj.myeasypage.com', desc: 'Freelancer portfolio with services & WhatsApp CTA.', icon: <UserCheck size={20} /> },
  { name: '@aisha', link: 'https://aisha.myeasypage.com', desc: 'Artist gallery + shop links and contact form.', icon: <Image size={20} /> },
  { name: '@startupdeck', link: 'https://startupdeck.myeasypage.com', desc: 'Product site with features, video embed & pricing.', icon: <Globe size={20} /> },
  { name: '@reelsbyzoe', link: 'https://reelsbyzoe.myeasypage.com', desc: 'Creator bio link with YouTube + Instagram embeds.', icon: <Video size={20} /> },
  { name: '@techhub', link: 'https://techhub.myeasypage.com', desc: 'Tech blog with newsletter signup + projects.', icon: <Globe size={20} /> },
  { name: '@chefamy', link: 'https://chefamy.myeasypage.com', desc: 'Food recipes with Instagram reels & YouTube.', icon: <Video size={20} /> },
];

export default function UserShowcase() {
  // duplicate list to simulate infinite loop
  const loopUsers = [...users, ...users];

  return (
    <section id="examples" className="section" aria-labelledby="examples-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="examples-title" className="section-title">Sites built on myeasypage</h2>
          <p className="section-subtitle">Real pages created by people like you — fast, polished, and live.</p>
        </div>

        <div className={styles.userCarousel}>
          <motion.div
            className={styles.userTrack}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
          >
            {loopUsers.map((u, i) => (
              <div key={`${u.name}-${i}`} className={styles.userCard}>
                <div className={styles.userIcon}>{u.icon}</div>
                <h4 className={styles.userHandle}>{u.name}</h4>
                <Link
                  href={u.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.userLink}
                  aria-label={`Open ${u.name} site`}
                >
                  {u.link}
                </Link>
                <p className={styles.userDesc}>{u.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
