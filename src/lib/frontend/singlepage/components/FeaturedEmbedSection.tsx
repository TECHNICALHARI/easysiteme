'use client';
import styles from '@/styles/preview.module.css';
import { Embed } from '@/lib/frontend/types/form';

export default function FeaturedEmbedSection({ embeds }: { embeds: Embed[] }) {
  return (
    <div className={styles.embedList}>
      {embeds.map((embed) => (
        <div key={embed.id} className={styles.embedItem}>
          <h4 className={styles.embedTitle}>{embed.title}</h4>
          <iframe
            src={embed.url}
            className={styles.embedFrame}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );
}
