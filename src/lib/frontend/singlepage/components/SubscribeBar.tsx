'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { FormData } from '@/lib/frontend/types/form';
import styles from '@/styles/preview.module.css';

export default function SubscribeBar({ form }: { form: FormData }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const settings = form.subscriberSettings?.subscriberSettings;

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect backend later
    setSubscribed(true);
    setEmail('');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${styles.subscribeBarWrapper} px-4 mt-12`}
    >
      <div className={`${styles.subscribeCard} max-w-4xl mx-auto`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className={`${styles.subscribeTitle}`}>
              {settings?.subject || 'Join the Newsletter'}
            </h3>
            <p className={`${styles.subscribeDesc}`}>
              {settings?.thankYouMessage ||
                'Be the first to get updates, resources, and premium content.'}
            </p>
          </div>

          {!subscribed ? (
            <form
              onSubmit={onSubscribe}
              className="flex w-full md:w-auto gap-3 justify-center md:justify-end"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={`${styles.subscribeInput}`}
              />
              <button
                type="submit"
                className={`${styles.subscribeButton}`}
              >
                <Mail size={18} />
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-[var(--color-brand)] font-semibold text-center md:text-right">
              🎉 Thanks for subscribing!
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
