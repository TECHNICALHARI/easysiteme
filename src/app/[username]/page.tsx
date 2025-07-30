'use client';

import clsx from 'clsx';
import { FormData } from '@/lib/frontend/types/form';
import dummyFormData from '@/lib/frontend/utils/dummyForm';
import BioLayout from '@/lib/frontend/singlepage/BioLayout';
import WebsiteLayout from '@/lib/frontend/singlepage/WebsiteLayout';
import PageLayout from '@/lib/frontend/singlepage/layout/PageLayout';
import themeStyles from '@/styles/theme.module.css';
import styles from '@/styles/preview.module.css';

interface PreviewProps {
  form?: FormData;
}

export default function PreviewPage({ form = dummyFormData }: PreviewProps) {
  const { design } = form;
  const layoutType = design?.layoutType || 'bio';
  const theme = design?.theme || 'brand';

  const Layout = layoutType === 'website' ? WebsiteLayout : BioLayout;
  const themeClass = themeStyles[theme] || themeStyles.brand;

  return (
    <div className={clsx(styles.previewWrapper, themeClass)} data-theme={theme}>
      <PageLayout form={form}>
        <div className={styles.previewContainer}>
          <Layout form={form} />
        </div>
      </PageLayout>
    </div>
  );
}
