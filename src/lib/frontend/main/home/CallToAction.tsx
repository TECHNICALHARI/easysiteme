'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className={styles.ctaSection}>
      <div className="container text-center relative z-10">
        <motion.h2
          className={styles.ctaTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Launch Your Page?
        </motion.h2>

        <motion.p
          className={styles.ctaSubtitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Build your branded website or portfolio in just a minute. No code, no stress — just you and your story.
        </motion.p>

        <motion.div
          className={styles.ctaActions}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/create" className="btn-primary">Create My Page</Link>
          <Link href="#plans" className="btn-white">Explore Plans</Link>
        </motion.div>

        <p className={styles.ctaNote}>No credit card required · Change anytime · Instant publishing</p>
      </div>
    </section>
  );
}
