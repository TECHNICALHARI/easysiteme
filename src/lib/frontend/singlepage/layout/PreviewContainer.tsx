'use client';

import React from 'react';
import styles from '@/styles/preview.module.css';

interface PreviewContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PreviewContainer({ children, className }: PreviewContainerProps) {
  return (
    <div className={`${styles.previewContainer} ${className || ''}`}>
      {children}
    </div>
  );
}
