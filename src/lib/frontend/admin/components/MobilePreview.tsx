'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import styles from '@/styles/admin.module.css';
import themeStyles from '@/styles/theme.module.css';

import type { FormData } from '../../types/form';
import WebsiteLayout from '../../singlepage/WebsiteLayout';
import BioLayout from '../../singlepage/BioLayout';
import PageLayout from '../../singlepage/layout/PageLayout';

interface Props {
  form: FormData;
}

const THEME_FALLBACK = 'brand' as const;

const MobilePreview: FC<Props> = ({ form }) => {
  const layoutType = form?.design?.layoutType ?? 'bio';
  const theme = form?.design?.theme ?? THEME_FALLBACK;

  const ThemeClass =
    (themeStyles as Record<string, string>)[theme] ??
    themeStyles[THEME_FALLBACK];

  return (
    <div className={styles.deviceFrame}>
      <div className={styles.deviceInner}>
        <div className={styles.notch}>
          <span className={styles.cameraDot} />
          <span className={styles.speakerGrill} />
        </div>

        <div className={styles.btnLeftTop} />
        <div className={styles.btnLeftMid} />
        <div className={styles.btnRight} />

        <div className={styles.screen}>
          <div
            className={clsx(styles.screenContent, ThemeClass)}
            data-theme={theme}
          >
            {layoutType === 'website' ? (
              <PageLayout form={form}>
                <WebsiteLayout form={{ ...form, previewMode: true }} />
              </PageLayout>
            ) : (
              <BioLayout form={{ ...form, previewMode: true }} />
            )}
          </div>
          <div className={styles.homeIndicator} />
        </div>
      </div>
      <div className={styles.deviceShadow} />
    </div>
  );
};

export default MobilePreview;
