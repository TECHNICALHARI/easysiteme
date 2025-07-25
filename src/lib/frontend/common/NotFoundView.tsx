'use client';

import Link from 'next/link';
import { Ghost } from 'lucide-react';
import styles from '@/styles/common.module.css';

interface NotFoundViewProps {
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
}

export default function NotFoundView({
  title = '404 - Page Not Found',
  description = "We couldn’t find what you’re looking for.",
  homeHref = '/',
  homeLabel = 'Back to Home',
}: NotFoundViewProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Ghost size={48} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{description}</p>
        <Link href={homeHref} className={styles.homeBtn}>
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}
