'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-title">
      <div className="container text-center relative z-10">
        <motion.h2
          id="cta-title"
          className={styles.ctaTitle}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
        >
          Launch your website, blog & bio link today
        </motion.h2>

        <motion.p
          className={styles.ctaSubtitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          viewport={{ once: true }}
        >
          Claim a free subdomain, add your sections and start publishing in minutes.
          Upgrade anytime for custom domain and advanced blocks.
        </motion.p>

        <motion.div
          className={styles.ctaActions}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/create" className="btn-primary">Create my site</Link>
          <Link href="#plans" className="btn-white">See pricing</Link>
        </motion.div>

        <p className={styles.ctaNote}>No credit card required · Switch layouts anytime · Instant publishing</p>
      </div>
    </section>
  );
}
