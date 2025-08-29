'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { faqs } from '../../utils/faqs';


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container">
        <div className="text-center">
          <h2 id="faq-title" className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">
            Everything about launching a website, blog and link-in-bio with myeasypage.
          </p>
        </div>

        <dl className={styles.faqWrapper}>
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <dt>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${idx}`}
                  >
                    {item.q}
                    <ChevronDown
                      className={`${styles.faqChevron} ${isOpen ? styles.rotate : ''}`}
                      size={20}
                      aria-hidden="true"
                    />
                  </button>
                </dt>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-${idx}`}
                      className={styles.faqAnswer}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p>{item.a}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
