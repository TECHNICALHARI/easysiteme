'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import type { FormData } from '@/lib/frontend/types/form';
import WebsiteLayout from '@/lib/frontend/singlepage/WebsiteLayout';
import BioLayout from '@/lib/frontend/singlepage/BioLayout';
import PageLayout from '@/lib/frontend/singlepage/layout/PageLayout';
import themeStyles from '@/styles/theme.module.css';
import previewStyles from '@/styles/preview.module.css';
import PreviewSkeleton from '@/lib/frontend/singlepage/components/PreviewSkeleton';

const hasAnyData = (f?: FormData | null) =>
  !!f &&
  !!(
    f.profile?.fullName ||
    f.profile?.username ||
    (f.profile?.links?.length ?? 0) > 0 ||
    (f.profile?.featured?.length ?? 0) > 0 ||
    (f.profile?.avatar && f.profile.avatar.length > 0)
  );

export default function AdminPreviewClient() {
  const { form, setForm, isLoading } = useAdminForm();

  const [incoming, setIncoming] = useState<FormData | null>(null);

  const theme = useMemo(() => (incoming ?? form)?.design?.theme ?? 'brand', [incoming, form]);
  const layoutType = useMemo(
    () => (incoming ?? form)?.design?.layoutType ?? 'bio',
    [incoming, form],
  );
  const ThemeClass = (themeStyles as Record<string, string>)[theme] ?? themeStyles['brand'];
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      const msg = ev.data;
      if (msg?.type === 'onepage:preview:update' && msg.payload) {
        setIncoming({ ...(msg.payload as FormData), previewMode: true });
      }
    };
    window.addEventListener('message', onMessage);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'onepage:preview:ready' }, '*');
    }
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const data: FormData | null = (() => {
    if (hasAnyData(incoming)) return incoming as FormData;
    if (hasAnyData(form)) return { ...form, previewMode: true } as FormData;
    return null;
  })();
  if (isLoading) {
    return (
      <div className={clsx(previewStyles.previewWrapper, ThemeClass)} data-theme={theme}>
        <PreviewSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={clsx(previewStyles.previewWrapper, ThemeClass)} data-theme={theme}>
        <div className={previewStyles.emptyState} aria-live="polite">
          Start editing to see your live preview.
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(previewStyles.previewWrapper, ThemeClass)} data-theme={theme}>
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
