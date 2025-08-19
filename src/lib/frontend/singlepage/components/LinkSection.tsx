'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { Link } from '@/lib/frontend/types/form';

export default function LinkSection({ links }: { links: Link[] }) {
  if (!links?.length) return null;

  return (
    <motion.section
      className={styles.linkSection}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {links.map((link) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.linkButton} ${link.highlighted ? styles.highlighted : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {link.title}
        </motion.a>
      ))}
    </motion.section>
  );
}
