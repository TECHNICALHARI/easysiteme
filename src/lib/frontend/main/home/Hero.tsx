'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';

export default function Hero() {
  const [username, setUsername] = useState('');

  return (
    <section className={styles.hero}>
      <div className={styles.heroBgDecor} />

      <div className="container relative z-10 text-center">
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Build Your Identity. <br />
          <span className={styles.gradientText}>In 60 Seconds or Less.</span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Secure your subdomain like <code>{username || 'yourname'}.easysiteme.com</code><br />
          — Instant. Beautiful. Professional.
        </motion.p>

        <motion.div
          className={styles.subdomainInput}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="text"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>.easysiteme.com</span>
        </motion.div>

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a href="/create" className="btn-primary">Start for Free</a>
          <a href="#plans" className="btn-white">View Pricing</a>
        </motion.div>
      </div>
    </section>
  );
}
