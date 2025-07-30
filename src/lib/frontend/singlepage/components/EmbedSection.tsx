'use client';

import styles from '@/styles/preview.module.css';
import { Embed } from '@/lib/frontend/types/form';

export default function EmbedSection({ embeds }: { embeds: Embed[] }) {
  if (!embeds?.length) return null;

  const isSingle = embeds.length === 1;

  return (
    <section className="px-4 mt-10">
      <h2 className={styles.sectionTitle}>Embeds</h2>
      <div className={`grid gap-6 ${isSingle ? '' : 'sm:grid-cols-1 md:grid-cols-2'}`}>
        {embeds.map((embed) => (
          <div key={embed.id} className={styles.embedCard}>
            <iframe
              src={embed.url}
              title={embed.title}
              className={styles.embedIframe}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <h3 className={styles.embedTitle}>{embed.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
