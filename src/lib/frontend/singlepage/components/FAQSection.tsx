'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from '@/styles/preview.module.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      id="faq"
      className="w-full max-w-3xl mx-auto px-4 mt-10"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>FAQs</h2>
      <div className={styles.faqWrapper}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={faq.id}
              className={styles.faqItem}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <button className={styles.faqQuestion} onClick={() => setOpenIndex(isOpen ? null : idx)}>
                {faq.question}
                <ChevronDown className={`${styles.faqChevron} ${isOpen ? styles.rotate : ''}`} size={18} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.faqAnswer}
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 500 }}
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className={styles.faqContent}>
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
