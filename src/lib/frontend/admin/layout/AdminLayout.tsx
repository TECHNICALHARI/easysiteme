// src/app/admin/AdminLayout.tsx
'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';
import { AdminFormContext, ProfileDesignSlice } from '@/lib/frontend/admin/context/AdminFormContext';
import type { FormData, ProfileTabData } from '@/lib/frontend/types/form';
import { usePreviewBus } from '@/lib/frontend/hooks/usePreviewBus';
import { loadDraft, useLocalDraft } from '@/lib/frontend/hooks/useLocalDraft';
import PreviewFab from './PreviewFab';
import { PlanType } from '@/config/PLAN_FEATURES';
import Loader from '@/lib/frontend/common/Loader';
import { useUser } from '@/lib/frontend/context/UserContext';
import { getProfileDesignApi, saveProfileDesignApi } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type ServerPartial = Partial<{
  profile: Partial<ProfileTabData>;
  design: Partial<FormData['design']>;
  settings: Partial<FormData['settings']>;
}>;

const EMPTY_PROFILE: FormData['profile'] = {
  fullName: '',
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
  socials: {
    youtube: '',
    instagram: '',
    calendly: '',
    facebook: '',
    LinkedIn: '',
  },
};

const EMPTY_DESIGN: FormData['design'] = { theme: 'brand', emojiLink: '', brandingOff: false, layoutType: 'bio' };

const DEFAULT_SETTINGS: FormData['settings'] = {
  nsfwWarning: false,
  preferredLink: 'primary',
  customDomain: '',
  gaId: '',
  subdomain: '',
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
};

function cleanDeep<T extends Record<string, any>>(obj?: T): Partial<T> {
  if (!obj || typeof obj !== 'object') return {};
  const out: any = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string') {
      if (v.trim() === '') continue;
      out[k] = v;
      continue;
    }
    if (typeof v === 'object') {
      if (Array.isArray(v)) {
        out[k] = v;
        continue;
      }
      const nested = cleanDeep(v as any);
      if (Object.keys(nested).length > 0) out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const path = pathname.replace(/\/+$/, '');
  const isPreviewRoute = useMemo(() => /(?:^|\/)admin\/preview(?:\/|$)/.test(path), [path]);

  const userCtx = useUser();
  const user = userCtx?.user ?? null;
  const userBootstrapped = userCtx?.isBootstrapped ?? false;

  const { showToast } = useToast();

  const [plan, setPlan] = useState<PlanType>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [serverSnapshot, setServerSnapshot] = useState<ServerPartial>({});
  const [profileDesign, setProfileDesign] = useState<ProfileDesignSlice>({
    profile: EMPTY_PROFILE,
    design: EMPTY_DESIGN,
  });

  const [settings, setSettings] = useState<FormData['settings']>(DEFAULT_SETTINGS);
  const [posts, setPosts] = useState<FormData['posts'] | undefined>(undefined);
  const [subscriberSettings, setSubscriberSettings] = useState<FormData['subscriberSettings'] | undefined>(undefined);
  const [stats, setStats] = useState<FormData['stats'] | undefined>(undefined);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (typeof user.plan === 'string' && user.plan) setPlan(user.plan as PlanType);
    setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), subdomain: prev?.subdomain || user.subdomain || '' }));
    setProfileDesign((pd) => ({
      profile: { ...pd.profile, email: pd.profile.email || user.email || '' },
      design: pd.design,
    }));
  }, [user]);

  useEffect(() => {
    if (!userBootstrapped) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    let aborted = false;
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoading(true);

        const draft = loadDraft();

        const res = await getProfileDesignApi({ signal: ac.signal }).catch(() => null);
        if (aborted) return;

        if (res && res.data) {
          const doc = (res.data.profileDesign ?? res.data) as any;

          const incomingProfile = (doc.profile ?? {}) as Partial<ProfileTabData>;
          const incomingDesign = (doc.design ?? {}) as Partial<FormData['design']>;
          const incomingSettings = (doc.settings ?? {}) as Partial<FormData['settings']>;

          setServerSnapshot({ profile: incomingProfile, design: incomingDesign, settings: incomingSettings });

          const cleanDraftProfile = cleanDeep(draft?.profile ?? {});
          const cleanDraftDesign = cleanDeep(draft?.design ?? {});
          const cleanDraftSettings = cleanDeep(draft?.settings ?? {});

          const mergedProfile = {
            ...EMPTY_PROFILE,
            ...(incomingProfile as any),
            ...cleanDraftProfile,
          } as FormData['profile'];

          const mergedDesign = {
            ...EMPTY_DESIGN,
            ...(incomingDesign as any),
            ...cleanDraftDesign,
          } as FormData['design'];

          const mergedSettings = {
            ...DEFAULT_SETTINGS,
            ...(incomingSettings as any),
            ...cleanDraftSettings,
          } as FormData['settings'];

          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
          setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), ...(mergedSettings || {}) } as FormData['settings']));
        } else {
          const cleanDraftProfile = cleanDeep(draft?.profile ?? {});
          const cleanDraftDesign = cleanDeep(draft?.design ?? {});
          const cleanDraftSettings = cleanDeep(draft?.settings ?? {});

          const mergedProfile = { ...EMPTY_PROFILE, ...cleanDraftProfile } as FormData['profile'];
          const mergedDesign = { ...EMPTY_DESIGN, ...cleanDraftDesign } as FormData['design'];
          const mergedSettings = { ...DEFAULT_SETTINGS, ...cleanDraftSettings } as FormData['settings'];

          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
          setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), ...(mergedSettings || {}) } as FormData['settings']));
        }

        setBootstrapped(true);
      } catch (err: any) {
        const next = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
        router.push(`/login?next=${encodeURIComponent(next)}`);
      } finally {
        if (!aborted) setIsLoading(false);
      }
    })();

    return () => {
      aborted = true;
      ac.abort();
    };
  }, [userBootstrapped, router]);

  const publishChanges = useCallback(async () => {
    try {
      const payload = {
        profile: profileDesign?.profile ?? {},
        design: profileDesign?.design ?? {},
        settings: settings ?? {},
      };
      const res = await saveProfileDesignApi(payload as any);
      if (res?.success) {
        const fresh = await getProfileDesignApi().catch(() => null);
        if (fresh && fresh.data) {
          const doc = (fresh.data.profileDesign ?? fresh.data) as any;
          const incomingProfile = (doc.profile ?? {}) as Partial<ProfileTabData>;
          const incomingDesign = (doc.design ?? {}) as Partial<FormData['design']>;
          const incomingSettings = (doc.settings ?? {}) as Partial<FormData['settings']>;

          setServerSnapshot({ profile: incomingProfile, design: incomingDesign, settings: incomingSettings });

          const mergedProfile = { ...EMPTY_PROFILE, ...(incomingProfile as any) } as FormData['profile'];
          const mergedDesign = { ...EMPTY_DESIGN, ...(incomingDesign as any) } as FormData['design'];

          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
          setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), ...(incomingSettings as any) } as FormData['settings']));
        }
        showToast(res?.message || 'Published successfully!', 'success');
      } else {
        showToast(res?.message || 'Publish failed', 'error');
      }
      return res;
    } catch (err: any) {
      showToast(err?.message || 'Publish failed', 'error');
      throw err;
    }
  }, [profileDesign, settings, showToast]);

  const composedForm = useMemo<FormData>(() => {
    return {
      profile: profileDesign.profile,
      design: profileDesign.design,
      settings: (settings as any) ?? DEFAULT_SETTINGS,
      posts: (posts as any) ?? ({ posts: [] } as FormData['posts']),
      subscriberSettings: (subscriberSettings as any) ?? ({} as FormData['subscriberSettings']),
      stats: (stats as any) ?? ({} as FormData['stats']),
    } as FormData;
  }, [profileDesign, settings, posts, subscriberSettings, stats]);

  const setForm = useCallback(
    (
      next:
        | Partial<FormData>
        | ((prev: {
            profile: FormData['profile'];
            design: FormData['design'];
            settings?: FormData['settings'];
            posts?: FormData['posts'];
            subscriberSettings?: FormData['subscriberSettings'];
            stats?: FormData['stats'];
          }) => Partial<FormData>)
    ) => {
      if (typeof next === 'function') {
        const computed = next({
          profile: profileDesign.profile,
          design: profileDesign.design,
          settings,
          posts,
          subscriberSettings,
          stats,
        });

        if (computed.profile || computed.design) {
          setProfileDesign((prev) => ({
            profile: computed.profile ? (computed.profile as FormData['profile']) : prev.profile,
            design: computed.design ? (computed.design as FormData['design']) : prev.design,
          }));
        }

        if ((computed as any).settings) {
          setSettings((s) => ({ ...(s || DEFAULT_SETTINGS), ...((computed as any).settings || {}) } as FormData['settings']));
        }
        if ((computed as any).posts) setPosts((computed as any).posts as FormData['posts']);
        if ((computed as any).subscriberSettings) setSubscriberSettings((computed as any).subscriberSettings as FormData['subscriberSettings']);
        if ((computed as any).stats) setStats((computed as any).stats as FormData['stats']);
      } else {
        if (next.profile || next.design) {
          setProfileDesign((prev) => ({
            profile: next.profile ? (next.profile as FormData['profile']) : prev.profile,
            design: next.design ? (next.design as FormData['design']) : prev.design,
          }));
        }
        if (next.settings) setSettings((s) => ({ ...(s || DEFAULT_SETTINGS), ...(next.settings || {}) } as FormData['settings']));
        if (next.posts) setPosts(next.posts as FormData['posts']);
        if (next.subscriberSettings) setSubscriberSettings(next.subscriberSettings as FormData['subscriberSettings']);
        if (next.stats) setStats(next.stats as FormData['stats']);
      }
    },
    [profileDesign, settings, posts, subscriberSettings, stats]
  );

  useLocalDraft(
    {
      profile: profileDesign.profile,
      design: profileDesign.design,
      settings: settings || DEFAULT_SETTINGS,
      posts: posts || ({ posts: [] } as FormData['posts']),
      subscriberSettings: subscriberSettings || ({} as FormData['subscriberSettings']),
      stats: stats || ({} as FormData['stats']),
    } as FormData,
    true,
    serverSnapshot as Partial<FormData>
  );

  usePreviewBus({ profile: profileDesign.profile, design: profileDesign.design } as FormData, plan);

  const contextValue = {
    form: composedForm,
    setForm,
    profileDesign,
    setProfileDesign,
    settings,
    setSettings: (next: Partial<FormData['settings']> | ((s: FormData['settings'] | undefined) => FormData['settings'])) => {
      if (typeof next === 'function') setSettings((s) => (next as any)(s));
      else setSettings((s) => ({ ...(s || DEFAULT_SETTINGS), ...(next || {}) } as FormData['settings']));
    },
    posts,
    setPosts: (next: FormData['posts'] | ((p: FormData['posts'] | undefined) => FormData['posts'])) => {
      if (typeof next === 'function') setPosts((p) => (next as any)(p));
      else setPosts(next as FormData['posts']);
    },
    subscriberSettings,
    setSubscriberSettings: (next:
      | FormData['subscriberSettings']
      | ((p: FormData['subscriberSettings'] | undefined) => FormData['subscriberSettings'])) => {
      if (typeof next === 'function') setSubscriberSettings((p) => (next as any)(p));
      else setSubscriberSettings(next as FormData['subscriberSettings']);
    },
    stats,
    setStats: (next: FormData['stats'] | ((p: FormData['stats'] | undefined) => FormData['stats'])) => {
      if (typeof next === 'function') setStats((p) => (next as any)(p));
      else setStats(next as FormData['stats']);
    },
    plan,
    isLoading,
    bootstrapped,
    publishChanges,
  };

  return (
    <AdminFormContext.Provider value={contextValue as any}>
      {isLoading && !bootstrapped ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : isPreviewRoute ? (
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
