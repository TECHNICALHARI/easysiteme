'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminFormContext } from '@/lib/frontend/admin/context/AdminFormContext';
import type { FormData } from '@/lib/frontend/types/form';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';
import '@/styles/globals.css';

const EMPTY_FORM: FormData = {
  profile: {
    fullName: '',
    username: '',
    title: '',
    bio: '',
    avatar: '',
    bannerImage: '',
    about: '',
    headers: [],
    links: [],
    embeds: [],
    testimonials: [],
    faqs: [],
    services: [],
    featured: [],
    tags: [],
    fullAddress: '',
    latitude: '',
    longitude: '',
    resumeUrl: '',
  },
  design: { theme: 'brand', emojiLink: '', brandingOff: false, layoutType: 'bio' },
  seo: { metaTitle: '', metaDescription: '' },
  settings: { nsfwWarning: false, preferredLink: 'primary', customDomain: '', gaId: '' },
  socials: { youtube: '', instagram: '', calendly: '' },
  posts: { posts: [] },
  subscriberSettings: {
    SubscriberList: { data: [], total: 0, active: 0, unsubscribed: 0 },
    subscriberSettings: { hideSubscribeButton: false, subject: '', thankYouMessage: '' },
  },
  plan: 'free',
};

function mergeForm(base: FormData, incoming: Partial<FormData>): FormData {
  return {
    ...base,
    ...incoming,
    profile: { ...base.profile, ...(incoming.profile || {}) },
    design: { ...base.design, ...(incoming.design || {}) },
    seo: { ...base.seo, ...(incoming.seo || {}) },
    settings: { ...base.settings, ...(incoming.settings || {}) },
    socials: { ...base.socials, ...(incoming.socials || {}) },
    posts: { ...base.posts, ...(incoming.posts || {}) },
    subscriberSettings: {
      ...base.subscriberSettings,
      ...(incoming.subscriberSettings || {}),
      SubscriberList: {
        ...base.subscriberSettings.SubscriberList,
        ...(incoming.subscriberSettings?.SubscriberList || {}),
      },
      subscriberSettings: {
        ...base.subscriberSettings.subscriberSettings,
        ...(incoming.subscriberSettings?.subscriberSettings || {}),
      },
    },
  };
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const path = pathname.replace(/\/+$/, '');
  const isPreviewRoute = useMemo(
    () => /(?:^|\/)admin\/preview(?:\/|$)/.test(path),
    [path],
  );

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  useEffect(() => {
    let embedded = false;
    if (typeof window !== 'undefined') {
      embedded = !!(window.parent && window.parent !== window);
    }

    // If this is the /admin/preview route *and* it is embedded (iframe),
    // do not fetch here. The parent admin page owns the fetch,
    // and the preview gets data via postMessage.
    if (isPreviewRoute && embedded) {
      setBootstrapped(true);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/form', {
          method: 'GET',
          credentials: 'include',
          signal: ac.signal,
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          const payload = (json?.data ?? json) as Partial<FormData>;
          if (payload && typeof payload === 'object') {
            setForm(prev => mergeForm(prev, payload));
          }
        }
      } catch {
        // swallow; we still bootstrap so UI can move on
      } finally {
        setIsLoading(false);
        setBootstrapped(true);
      }
    })();

    return () => ac.abort();
  }, [isPreviewRoute]);

  return (
    <AdminFormContext.Provider value={{ form, setForm, isLoading, bootstrapped }}>
      {/* For preview route we render without chrome, but provider always wraps children */}
      {isPreviewRoute ? (
        <>{children}</>
      ) : (
        <>
          <AdminHeader />
          <Container>{children}</Container>
        </>
      )}
    </AdminFormContext.Provider>
  );
}
