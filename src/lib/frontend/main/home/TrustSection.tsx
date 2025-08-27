'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Server, TimerReset, LockKeyhole, Globe2, Zap } from 'lucide-react';
import styles from '@/styles/main.module.css';

const items = [
  { title: 'Secure login', desc: 'Passwordless magic-link authentication keeps your account safe.', icon: <ShieldCheck size={22} className={styles.trustIcon} /> },
  { title: 'Edge performance', desc: 'Global delivery for snappy loads wherever your audience lives.', icon: <Server size={22} className={styles.trustIcon} /> },
  { title: 'Instant publish', desc: 'Go from edit to live in seconds — no deployments needed.', icon: <TimerReset size={22} className={styles.trustIcon} /> },
  { title: 'Privacy-first', desc: 'Clean analytics and sensible defaults that respect your visitors.', icon: <LockKeyhole size={22} className={styles.trustIcon} /> },
  { title: 'Uptime you can trust', desc: 'Reliable hosting and automatic scaling as you grow.', icon: <Globe2 size={22} className={styles.trustIcon} /> },
  { title: 'Optimized by default', desc: 'Images, caching and meta basics handled for you.', icon: <Zap size={22} className={styles.trustIcon} /> },
];

export default function TrustSection() {
  return (
    <section className="section bg-muted" id="trust" aria-labelledby="trust-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="trust-title" className="section-title">Built for speed & trust</h2>
          <p className="section-subtitle">Modern performance, security and UX — without extra setup.</p>
        </div>

        <div className={styles.trustGrid}>
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              className={styles.trustCard}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              viewport={{ once: true }}
            >
              <div className={styles.trustIconWrapper}>{it.icon}</div>
              <h4 className={styles.trustTitle}>{it.title}</h4>
              <p className={styles.trustText}>{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
