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
import { getProfileDesign } from '@/lib/frontend/api/services';

type ServerPartial = Partial<{
  profile: Partial<ProfileTabData>;
  design: Partial<FormData['design']>;
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
};

const EMPTY_DESIGN: FormData['design'] = { theme: 'brand', emojiLink: '', brandingOff: false, layoutType: 'bio' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const path = pathname.replace(/\/+$/, '');
  const isPreviewRoute = useMemo(() => /(?:^|\/)admin\/preview(?:\/|$)/.test(path), [path]);

  const userCtx = useUser();
  const user = userCtx?.user ?? null;
  const userBootstrapped = userCtx?.isBootstrapped ?? false;

  const [plan, setPlan] = useState<PlanType>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  const [serverSnapshot, setServerSnapshot] = useState<ServerPartial>({});

  const [profileDesign, setProfileDesign] = useState<ProfileDesignSlice>({
    profile: EMPTY_PROFILE,
    design: EMPTY_DESIGN,
  });

  // Other data will be fetched/managed by individual tabs (not stored in draft here)
  const [settings, setSettings] = useState<FormData['settings'] | undefined>(undefined as any);
  const [posts, setPosts] = useState<FormData['posts'] | undefined>(undefined as any);
  const [subscriberSettings, setSubscriberSettings] = useState<FormData['subscriberSettings'] | undefined>(undefined as any);
  const [stats, setStats] = useState<FormData['stats'] | undefined>(undefined as any);
  const [socials, setSocials] = useState<FormData['socials'] | undefined>(undefined as any);

  const initializedRef = useRef(false);

  // sync simple user properties into admin state (plan, subdomain, email fallback)
  useEffect(() => {
    if (!user) return;
    if (typeof user.plan === 'string' && user.plan) setPlan(user.plan as PlanType);
    setSettings((s) => {
      // only set subdomain from user if settings is not yet set
      if (s) return { ...s, subdomain: s.subdomain || user.subdomain || '' } as any;
      // keep undefined if not desired — but provide a minimal object to avoid crashes in UI that expects settings
      return { nsfwWarning: false, preferredLink: 'primary', customDomain: '', gaId: '', subdomain: user.subdomain || '', seo: { metaTitle: '', metaDescription: '', metaKeywords: [], canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '', noIndex: false, noFollow: false } } as any;
    });
    setProfileDesign((pd) => ({
      profile: { ...pd.profile, email: pd.profile.email || user.email || '' },
      design: pd.design,
    }));
  }, [user]);

  // only bootstrap once after user context is ready
  useEffect(() => {
    if (!userBootstrapped) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    let aborted = false;
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoading(true);

        // load any existing draft from localStorage (draft contains only profile/design)
        const draft = loadDraft();

        // fetch profile+design from server (single source for autosave/profile)
        const res = await getProfileDesign({ signal: ac.signal }).catch(() => null);
        if (aborted) return;

        if (res && res.data) {
          const incomingProfile = (res.data.profile ?? {}) as Partial<ProfileTabData>;
          const incomingDesign = (res.data.design ?? {}) as Partial<FormData['design']>;

          setServerSnapshot({ profile: incomingProfile, design: incomingDesign });

          const mergedProfile = { ...EMPTY_PROFILE, ...(incomingProfile as any), ...(draft?.profile ?? {}) } as FormData['profile'];
          const mergedDesign = { ...EMPTY_DESIGN, ...(incomingDesign as any), ...(draft?.design ?? {}) } as FormData['design'];

          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
        } else {
          // fallback to draft only (no server data)
          const mergedProfile = { ...EMPTY_PROFILE, ...(draft?.profile ?? {}) } as FormData['profile'];
          const mergedDesign = { ...EMPTY_DESIGN, ...(draft?.design ?? {}) } as FormData['design'];
          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
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

  // keep a composedForm for consumer convenience. Other pieces (posts/stats/etc) are left undefined
  const composedForm = useMemo<FormData>(() => {
    return {
      profile: profileDesign.profile,
      design: profileDesign.design,
      settings: (settings as any) ?? ({} as any),
      socials: (socials as any) ?? ({} as any),
      posts: (posts as any) ?? ({ posts: [] } as any),
      subscriberSettings: (subscriberSettings as any) ?? ({} as any),
      stats: (stats as any) ?? ({} as any),
    } as unknown as FormData;
  }, [profileDesign, settings, socials, posts, subscriberSettings, stats]);

  // setForm updater — safely merge only profile/design when provided (avoids returning undefined fields)
  const setForm = useCallback(
    (
      next:
        | Partial<FormData>
        | ((prev: {
            profile: FormData['profile'];
            design: FormData['design'];
            settings?: FormData['settings'];
            socials?: FormData['socials'];
            posts?: FormData['posts'];
            subscriberSettings?: FormData['subscriberSettings'];
            stats?: FormData['stats'];
          }) => Partial<FormData>)
    ) => {
      if (typeof next === 'function') {
        // compute against current composed minimal shape
        const computed = next({
          profile: profileDesign.profile,
          design: profileDesign.design,
          settings,
          socials,
          posts,
          subscriberSettings,
          stats,
        } as any);

        if (computed.profile || computed.design) {
          setProfileDesign((prev) => ({
            profile: computed.profile ? (computed.profile as FormData['profile']) : prev.profile,
            design: computed.design ? (computed.design as FormData['design']) : prev.design,
          }));
        }

        if ((computed as any).settings) setSettings((s) => ({ ...(s || {}), ...((computed as any).settings || {}) } as any));
        if ((computed as any).socials) setSocials((s) => ({ ...(s || {}), ...((computed as any).socials || {}) } as any));
        if ((computed as any).posts) setPosts((p) => (computed as any).posts);
        if ((computed as any).subscriberSettings) setSubscriberSettings((p) => (computed as any).subscriberSettings);
        if ((computed as any).stats) setStats((p) => (computed as any).stats);
      } else {
        if (next.profile || next.design) {
          setProfileDesign((prev) => ({
            profile: next.profile ? (next.profile as FormData['profile']) : prev.profile,
            design: next.design ? (next.design as FormData['design']) : prev.design,
          }));
        }
        if (next.settings) setSettings((s) => ({ ...(s || {}), ...(next.settings || {}) } as any));
        if (next.socials) setSocials((s) => ({ ...(s || {}), ...(next.socials || {}) } as any));
        if (next.posts) setPosts(next.posts as any);
        if (next.subscriberSettings) setSubscriberSettings(next.subscriberSettings as any);
        if (next.stats) setStats(next.stats as any);
      }
    },
    [profileDesign, settings, socials, posts, subscriberSettings, stats]
  );

  // persist only profile+design diffs to local draft (useLocalDraft checks profile/design vs serverSnapshot)
  useLocalDraft(
    {
      profile: profileDesign.profile,
      design: profileDesign.design,
      settings: {} as any,
      socials: {} as any,
      posts: { posts: [] } as any,
      subscriberSettings: {} as any,
      stats: {} as any,
    } as FormData,
    true,
    serverSnapshot as Partial<FormData>
  );

  usePreviewBus(
    (() => {
      return {
        profile: profileDesign.profile,
        design: profileDesign.design,
        settings: (settings as any) || {},
        socials: (socials as any) || {},
        posts: (posts as any) || ({ posts: [] } as any),
        subscriberSettings: (subscriberSettings as any) || ({} as any),
        stats: (stats as any) || ({} as any),
      } as unknown as FormData;
    })(),
    plan
  );

  const contextValue = {
    form: composedForm as FormData,
    setForm,
    profileDesign,
    setProfileDesign,
    settings,
    setSettings: (next: Partial<FormData['settings']> | ((s: FormData['settings'] | undefined) => FormData['settings'])) => {
      if (typeof next === 'function') setSettings((s) => (next as any)(s));
      else setSettings((s) => ({ ...(s || {}), ...(next || {}) } as any));
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
