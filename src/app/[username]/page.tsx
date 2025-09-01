'use client';

import clsx from 'clsx';
import BioLayout from '@/lib/frontend/singlepage/BioLayout';
import WebsiteLayout from '@/lib/frontend/singlepage/WebsiteLayout';
import PageLayout from '@/lib/frontend/singlepage/layout/PageLayout';
import { useUserPage } from '@/lib/frontend/singlepage/context/UserPageProvider';

import themeStyles from '@/styles/theme.module.css';
import styles from '@/styles/preview.module.css';

const THEME_FALLBACK = 'brand' as const;

export default function PreviewPage() {
  const { data } = useUserPage(); 
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">This page is not available.</p>
      </div>
    );
  }

  const layoutType = data.design?.layoutType ?? 'bio';
  const theme = data.design?.theme ?? THEME_FALLBACK;

  const ThemeClass =
    (themeStyles as Record<string, string>)[theme] ?? themeStyles[THEME_FALLBACK];

  return (
    <div className={clsx(styles.previewWrapper, ThemeClass)} data-theme={theme}>
      {layoutType === 'website' ? (
        <PageLayout form={data}>
          <WebsiteLayout form={data} />
        </PageLayout>
      ) : (
        <BioLayout form={data} />
      )}
    </div>
  );
}
