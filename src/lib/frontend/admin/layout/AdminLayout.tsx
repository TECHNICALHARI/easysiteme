'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';
import { AdminFormContext } from '@/lib/frontend/admin/context/AdminFormContext';
import type { FormData } from '@/lib/frontend/types/form';
import { usePreviewBus } from '@/lib/frontend/hooks/usePreviewBus';
import { loadDraft, useLocalDraft } from '@/lib/frontend/hooks/useLocalDraft';
import PreviewFab from './PreviewFab';
import { PlanType } from '@/config/PLAN_FEATURES';

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
    email: '',
    phone: '',
    website: '',
    whatsapp: '',
    showContactForm: false,
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const path = pathname.replace(/\/+$/, '');
  const isPreviewRoute = useMemo(() => /(?:^|\/)admin\/preview(?:\/|$)/.test(path), [path]);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [plan, setPlan] = useState<PlanType>('pro');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  useEffect(() => {
    try {
      const draft = loadDraft();
      if (draft && typeof draft === 'object') {
        setForm(prev => mergeForm(prev, draft));
      }
    } catch { }
  }, []);

  useEffect(() => {
    let embedded = false;
    if (typeof window !== 'undefined') embedded = !!(window.parent && window.parent !== window);
    if (isPreviewRoute && embedded) {
      setIsLoading(false);
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
          const payload = json?.data ?? json;

          if (payload && typeof payload === 'object') {
            if (payload.plan) {
              setPlan(payload.plan as PlanType); 
            }
            const { plan: _ignore, ...rest } = payload;
            setForm(prev => mergeForm(prev, rest));
          }
        }
      } catch {
      } finally {
        setIsLoading(false);
        setBootstrapped(true);
      }
    })();

    return () => ac.abort();
  }, [isPreviewRoute]);

  useLocalDraft(form, true);
  usePreviewBus(form, plan);

  return (
    <AdminFormContext.Provider value={{ form, setForm, plan, isLoading, bootstrapped }}>
      {isPreviewRoute ? (
        <>{children}</>
      ) : (
        <>
          <AdminHeader />
          <Container>{children}</Container>
          <PreviewFab />
        </>
      )}
    </AdminFormContext.Provider>
  );
}
