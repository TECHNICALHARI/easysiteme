"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "@/styles/preview.module.css";

export default function FAQSection({ faqs }: { faqs?: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <motion.section
      id="faq"
      className="w-full max-w-3xl mx-auto px-4 mt-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>FAQs</h2>
      <div className={styles.faqWrapper}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={faq.id ?? idx}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.26 }}
              viewport={{ once: true }}
            >
              <button className={styles.faqQuestion} onClick={() => setOpenIndex(isOpen ? null : idx)}>
                <span>{faq.question || "Untitled question"}</span>
                <ChevronDown className={`${styles.faqChevron} ${isOpen ? styles.rotate : ""}`} size={18} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.faqAnswer}
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 500 }}
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className={styles.faqContent}>
                      <p>{faq.answer || ""}</p>
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
