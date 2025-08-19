'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import type { FormData } from '@/lib/frontend/types/form';

export default function SubscribeSection({ form }: { form: FormData }) {
  const [email, setEmail] = useState('');
  const settings = form.subscriberSettings?.subscriberSettings;
  const canSubscribe = !settings?.hideSubscribeButton;

  if (!canSubscribe) return null;

  const handleSubscribe = () => {
    if (!email) return alert('Please enter a valid email.');
    alert(settings?.thankYouMessage || 'Thanks for subscribing!');
    setEmail('');
  };

  const handleUnsubscribe = () => {
    if (!email) return alert('Please enter your email to unsubscribe.');
    alert('You have been unsubscribed.');
    setEmail('');
  };

  return (
    <section id="subscribe" className={styles.subscribeHeroDark}>
      <motion.div
        className={styles.subscribeHeroInner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <motion.h2
          className={styles.subscribeHeroTitle}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {settings?.subject || 'Subscribe to Stay Updated'}
        </motion.h2>
        <motion.p
          className={styles.subscribeHeroSubtitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Get the latest updates, tips & exclusive content straight to your inbox.
        </motion.p>

        <motion.div
          className={styles.subscribeHeroForm}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.subscribeHeroInput}
          />
          <button className={styles.subscribeHeroBtn} onClick={handleSubscribe}>
            Subscribe
          </button>
          <button className={styles.unsubscribeHeroBtn} onClick={handleUnsubscribe}>
            Unsubscribe
          </button>
        </motion.div>
      </motion.div>

      <div className={styles.subscribeGlow} />
    </section>
  );
}
