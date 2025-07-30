'use client';

import styles from '@/styles/preview.module.css';
import { Link } from '@/lib/frontend/types/form';

export default function LinkSection({ links }: { links: Link[] }) {
  if (!links?.length) return null;

  return (
    <section className={styles.linkSection}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.linkButton} ${link.highlighted ? styles.highlighted : ''}`}
        >
          {link.title}
        </a>
      ))}
    </section>
  );
}
