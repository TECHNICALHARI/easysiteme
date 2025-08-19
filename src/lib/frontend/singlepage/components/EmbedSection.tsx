'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { Embed } from '@/lib/frontend/types/form';

export default function EmbedSection({ embeds }: { embeds: Embed[] }) {
  if (!embeds?.length) return null;

  const isSingle = embeds.length === 1;

  return (
    <motion.section
      className="px-4 mt-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className={styles.sectionTitle}>Embeds</h2>
      <div className={`grid gap-6 ${isSingle ? '' : 'sm:grid-cols-1 md:grid-cols-2'}`}>
        {embeds.map((embed, i) => (
          <motion.div
            key={embed.id}
            className={styles.embedCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <iframe
              src={embed.url}
              title={embed.title}
              className={styles.embedIframe}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <h3 className={styles.embedTitle}>{embed.title}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
