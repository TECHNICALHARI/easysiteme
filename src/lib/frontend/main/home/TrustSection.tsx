'use client';

import { motion } from 'framer-motion';
import { Star, Server, TimerReset } from 'lucide-react';
import styles from '@/styles/main.module.css';

const stats = [
  {
    title: '4.9/5 Rating',
    desc: 'Based on 1,200+ verified creator reviews.',
    icon: <Star size={24} className={styles.trustIcon} />,
  },
  {
    title: '99.98% Uptime',
    desc: 'Lightning-fast, global delivery via Vercel Edge CDN.',
    icon: <Server size={24} className={styles.trustIcon} />,
  },
  {
    title: '< 2 min Setup',
    desc: 'From signup to live link — the fastest builder online.',
    icon: <TimerReset size={24} className={styles.trustIcon} />,
  },
];

export default function TrustSection() {
  return (
    <section className="section bg-muted" id="trust">
      <div className="container text-center">
        <h2 className="section-title">Trusted by Creators & Small Teams</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Over <strong>3,200+</strong> users launched their digital identity with OnePage — from solo creators to fast-growing startups.
        </p>

        <div className={styles.trustGrid}>
          {stats.map(({ title, desc, icon }, i) => (
            <motion.div
              key={i}
              className={styles.trustCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.trustIconWrapper}>{icon}</div>
              <h4 className={styles.trustTitle}>{title}</h4>
              <p className={styles.trustText}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
