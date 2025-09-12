'use client';

import React, { JSX } from 'react';
import styles from '@/styles/loader.module.css';

export default function Loader(): JSX.Element {
  return (
    <div className={styles.loaderWrap}>
      <div className={styles.ring}>
        <div className={styles.segment}></div>
      </div>
      <div className={styles.label}>Loading…</div>
    </div>
  );
}
