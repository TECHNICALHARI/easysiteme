"use client";
import { motion } from 'framer-motion';
import { ShieldCheck, Server, TimerReset, LockKeyhole, Globe2, Zap } from 'lucide-react';
import styles from '@/styles/main.module.css';

const items = [
  { title: 'Secure login', desc: 'Account protection with modern authentication.', Icon: ShieldCheck },
  { title: 'Edge performance', desc: 'Global delivery for snappy loads wherever your audience lives.', Icon: Server },
  { title: 'Instant publish', desc: 'Go from edit to live in seconds — no deployments needed.', Icon: TimerReset },
  { title: 'Privacy-first', desc: 'Clean analytics and sensible defaults that respect your visitors.', Icon: LockKeyhole },
  { title: 'Uptime you can trust', desc: 'Reliable hosting and automatic scaling as you grow.', Icon: Globe2 },
  { title: 'Optimized by default', desc: 'Images, caching and meta basics handled for you.', Icon: Zap },
];

export default function TrustSection() {
  return (
    <section className="section bg-muted" id="trust" aria-labelledby="trust-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="trust-title" className="section-title">
            Built for speed & trust
          </h2>
          <p className="section-subtitle">
            Modern performance, security and UX — without extra setup.
          </p>
        </div>

        <ul className={styles.trustGrid} role="list" aria-label="Trust and performance features">
          {items.map((it, i) => (
            <motion.li
              key={it.title}
              className={styles.trustCard}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              viewport={{ once: true }}
            >
              <div className={styles.trustIconWrapper} aria-hidden="true">
                <it.Icon size={22} className={styles.trustIcon} />
              </div>
              <h3 className={styles.trustTitle}>{it.title}</h3>
              <p className={styles.trustText}>{it.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
