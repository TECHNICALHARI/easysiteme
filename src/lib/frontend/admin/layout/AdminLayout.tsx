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
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    noIndex: false,
    noFollow: false,
  },
  settings: { nsfwWarning: false, preferredLink: 'primary', customDomain: '', gaId: '' },
  socials: { youtube: '', instagram: '', calendly: '' },
  posts: { posts: [] },
  subscriberSettings: {
    SubscriberList: { data: [], total: 0, active: 0, unsubscribed: 0 },
    subscriberSettings: { hideSubscribeButton: false, subject: '', thankYouMessage: '' },
  },
  stats: {
    linkClicks: [],
    trafficSources: [],
    contactSubmissions: [],
    topLinks: [],
  },
};

function mergeForm(
  base: FormData,
  apiData?: Partial<FormData>,
  draft?: Partial<FormData>
): FormData {
  return {
    ...base,
    ...apiData,
    ...draft,
    profile: { ...base.profile, ...apiData?.profile, ...draft?.profile },
    design: { ...base.design, ...apiData?.design, ...draft?.design },
    seo: { ...base.seo, ...apiData?.seo, ...draft?.seo },
    settings: { ...base.settings, ...apiData?.settings, ...draft?.settings },
    socials: { ...base.socials, ...apiData?.socials, ...draft?.socials },
    posts: { ...base.posts, ...apiData?.posts, ...draft?.posts },
    subscriberSettings: {
      SubscriberList: {
        ...base.subscriberSettings.SubscriberList,
        ...apiData?.subscriberSettings?.SubscriberList,
        ...draft?.subscriberSettings?.SubscriberList,
      },
      subscriberSettings: {
        ...base.subscriberSettings.subscriberSettings,
        ...apiData?.subscriberSettings?.subscriberSettings,
        ...draft?.subscriberSettings?.subscriberSettings,
      },
    },
    stats: {
      ...base.stats,
      ...apiData?.stats,
      ...draft?.stats,
    },
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const path = pathname.replace(/\/+$/, '');
  const isPreviewRoute = useMemo(() => /(?:^|\/)admin\/preview(?:\/|$)/.test(path), [path]);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [serverData, setServerData] = useState<Partial<FormData>>({});
  const [plan, setPlan] = useState<PlanType>('pro');
  const [isLoading, setIsLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      setForm((prev) => mergeForm(prev, {}, draft));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let embedded = false;
    if (window.parent && window.parent !== window) embedded = true;
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
            if (payload.plan) setPlan(payload.plan as PlanType);
            setServerData(payload);
            const draft = loadDraft();
            setForm((prev) => mergeForm(prev, payload, draft));
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

  useLocalDraft(form, true, serverData);
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
