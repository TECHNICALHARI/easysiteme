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

const CACHE_KEY = 'myeasypage:preview:last';
const BUS_NAME = 'myeasypage:preview';

const hasAnyData = (f?: FormData | null) =>
  !!f &&
  !!(
    f.profile?.fullName ||
    (f.profile?.links?.length ?? 0) > 0 ||
    (f.profile?.featured?.length ?? 0) > 0 ||
    (f.profile?.avatar && f.profile.avatar.length > 0)
  );

export default function AdminPreviewClient() {
  const ctx = useAdminForm() as any;
  const { form: formFromCtx, profileDesign, settings, posts, subscriberSettings, stats, isLoading } = ctx;

  // incoming from messages/broadcast channel (same as before)
  const [incoming, setIncoming] = useState<FormData | null>(null);

  useEffect(() => {
    const onWin = (ev: MessageEvent) => {
      const msg = ev.data;
      if (msg?.type === 'myeasypage:preview:update' && msg.payload) {
        setIncoming({ ...(msg.payload as FormData), previewMode: true });
      }
      if (msg?.type === 'myeasypage:preview:ping') {
        window.postMessage({ type: 'myeasypage:preview:ready' }, '*');
      }
    };
    window.addEventListener('message', onWin);

    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel(BUS_NAME);
      const onBus = (e: MessageEvent) => {
        if (e.data?.type === 'myeasypage:preview:update' && e.data.payload) {
          setIncoming({ ...(e.data.payload as FormData), previewMode: true });
        }
      };
      ch.addEventListener('message', onBus);

      // cold-start fallback
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as FormData;
          if (hasAnyData(parsed)) setIncoming({ ...parsed, previewMode: true });
        }
      } catch {}

      // announce ready
      try { window.parent?.postMessage({ type: 'myeasypage:preview:ready' }, '*'); } catch {}
      try { window.opener?.postMessage({ type: 'myeasypage:preview:ready' }, '*'); } catch {}

      return () => {
        window.removeEventListener('message', onWin);
        ch?.removeEventListener('message', onBus);
        ch?.close();
      };
    } catch {
      return () => {
        window.removeEventListener('message', onWin);
      };
    }
  }, []);

  // Build a merged form from the admin context pieces (prefer profileDesign slices, fallback to form)
  const mergedFromAdminContext = useMemo<FormData>(() => {
    const profile = (profileDesign && profileDesign.profile) || (formFromCtx && formFromCtx.profile) || ({} as any);
    const design = (profileDesign && profileDesign.design) || (formFromCtx && formFromCtx.design) || ({} as any);

    return {
      profile,
      design,
      settings: settings ?? (formFromCtx && formFromCtx.settings) ?? ({} as any),
      posts: posts ?? (formFromCtx && formFromCtx.posts) ?? ({} as any),
      subscriberSettings: subscriberSettings ?? (formFromCtx && formFromCtx.subscriberSettings) ?? ({} as any),
      stats: stats ?? (formFromCtx && formFromCtx.stats) ?? ({} as any),
      previewMode: true,
    } as FormData;
  }, [profileDesign, formFromCtx, settings, posts, subscriberSettings, stats]);

  // decide which data to show: incoming (live message) > mergedFromAdminContext > formFromCtx
  const theme = useMemo(() => (incoming ?? mergedFromAdminContext ?? formFromCtx)?.design?.theme ?? 'brand', [incoming, mergedFromAdminContext, formFromCtx]);
  const layoutType = useMemo(() => (incoming ?? mergedFromAdminContext ?? formFromCtx)?.design?.layoutType ?? 'bio', [incoming, mergedFromAdminContext, formFromCtx]);
  const ThemeClass = (themeStyles as Record<string, string>)[theme] ?? themeStyles['brand'];

  const data: FormData | null = (() => {
    if (hasAnyData(incoming)) return incoming as FormData;
    if (hasAnyData(mergedFromAdminContext)) return { ...mergedFromAdminContext, previewMode: true } as FormData;
    if (hasAnyData(formFromCtx)) return { ...(formFromCtx as FormData), previewMode: true } as FormData;
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
