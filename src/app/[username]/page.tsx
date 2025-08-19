'use client';

import clsx from 'clsx';
import type { FormData } from '@/lib/frontend/types/form';
import dummyFormData from '@/lib/frontend/utils/dummyForm';
import BioLayout from '@/lib/frontend/singlepage/BioLayout';
import WebsiteLayout from '@/lib/frontend/singlepage/WebsiteLayout';
import PageLayout from '@/lib/frontend/singlepage/layout/PageLayout';
import themeStyles from '@/styles/theme.module.css';
import styles from '@/styles/preview.module.css';

interface PreviewProps {
  form?: FormData;
}

const THEME_FALLBACK = 'brand' as const;

export default function PreviewPage({ form = dummyFormData }: PreviewProps) {
  const layoutType = form?.design?.layoutType ?? 'bio';
  const theme = form?.design?.theme ?? THEME_FALLBACK;
  const ThemeClass =
    (themeStyles as Record<string, string>)[theme] ?? themeStyles[THEME_FALLBACK];

  return (
    <div className={clsx(styles.previewWrapper, ThemeClass)} data-theme={theme}>
      {layoutType === 'website' ? (
        <PageLayout form={form}>
          <div className={styles.previewContainer}>
            <WebsiteLayout form={form} />
          </div>
        </PageLayout>
      ) : (
        <div className={`${styles.previewContainer} ${styles.BioPreviewContainer}`}>
          <BioLayout form={form} />
        </div>
      )}
    </div>
  );
}
