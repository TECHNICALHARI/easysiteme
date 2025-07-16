'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from '@/styles/main.module.css';

const faqs = [
  {
    q: 'Is OnePage really free to use?',
    a: 'Yes! Our Free plan gives you all the basics you need to launch your profile page — no credit card required.',
  },
  {
    q: 'How is this different from Linktree or Carrd?',
    a: 'OnePage gives you richer sections like About, Gallery, Testimonials, Forms — not just links. Plus, you get your own subdomain and cleaner branding.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Custom domain support is coming soon for Pro users. Currently, you’ll get a free subdomain like raj.onepage.site.',
  },
  {
    q: 'Is OnePage mobile friendly?',
    a: 'Absolutely. All pages and layouts are fully responsive and optimized for mobile, tablet, and desktop.',
  },
  {
    q: 'Can I use it without any tech knowledge?',
    a: 'Yes! No coding, designing, or hosting knowledge needed. Just fill out a form, hit publish, and you’re live.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section bg-muted">
      <div className="container text-center">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle max-w-xl mx-auto">
          Everything you need to know before creating or upgrading your OnePage site.
        </p>

        <div className={styles.faqWrapper}>
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  {item.q}
                  <ChevronDown
                    className={`${styles.faqChevron} ${isOpen ? styles.rotate : ''}`}
                    size={20}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
