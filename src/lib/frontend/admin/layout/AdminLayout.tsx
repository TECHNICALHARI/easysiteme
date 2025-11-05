'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';
import { AdminFormContext, ProfileDesignSlice } from '@/lib/frontend/admin/context/AdminFormContext';
import type { FormData, ProfileTabData } from '@/lib/frontend/types/form';
import { usePreviewBus } from '@/lib/frontend/hooks/usePreviewBus';
import PreviewFab from './PreviewFab';
import { PlanType } from '@/config/PLAN_FEATURES';
import Loader from '@/lib/frontend/common/Loader';
import { useUser } from '@/lib/frontend/context/UserContext';
import { getProfileDesignApi, getProfileDesignDraftApi, saveProfileDesignApi } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import useAutoSaveDraft from '@/lib/frontend/hooks/useAutoSaveDraft';
import ConfirmModal from '@/lib/frontend/common/ConfirmModal';

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

function cleanDeep<T extends Record<string, any>>(obj?: T, keepEmptyKeys: Set<string> = new Set()): Partial<T> {
  if (!obj || typeof obj !== 'object') return {};
  const out: any = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v === null) {
      if (keepEmptyKeys.has(k)) out[k] = v;
      continue;
    }
    if (typeof v === 'string') {
      if (v.trim() === '' && !keepEmptyKeys.has(k)) continue;
      out[k] = v;
      continue;
    }
    if (typeof v === 'object') {
      if (Array.isArray(v)) {
        out[k] = v;
        continue;
      }
      const nested = cleanDeep(v as any, keepEmptyKeys);
      if (Object.keys(nested).length > 0 || keepEmptyKeys.has(k)) out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out;
}

const hasAnyData = (f?: Partial<FormData> | null) =>
  !!f &&
  !!(
    (f.profile as any)?.fullName ||
    ((f.profile as any)?.links?.length ?? 0) > 0 ||
    ((f.profile as any)?.featured?.length ?? 0) > 0 ||
    ((f.profile as any)?.avatar && (f.profile as any).avatar.length > 0)
  );

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
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
  const [profileDesign, setProfileDesign] = useState<ProfileDesignSlice>({ profile: EMPTY_PROFILE, design: EMPTY_DESIGN });

  const [settings, setSettings] = useState<FormData['settings']>(DEFAULT_SETTINGS);
  const [posts, setPosts] = useState<FormData['posts'] | undefined>(undefined);
  const [subscriberSettings, setSubscriberSettings] = useState<FormData['subscriberSettings'] | undefined>(undefined);
  const [stats, setStats] = useState<FormData['stats'] | undefined>(undefined);

  const initializedRef = useRef(false);
  const loadedOnceRef = useRef(false);
  const userEditedRef = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (typeof user.plan === 'string' && user.plan) setPlan(user.plan as PlanType);
    setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), subdomain: prev?.subdomain || user.subdomain || '' }));
    setProfileDesign((pd) => ({ profile: { ...pd.profile, email: pd.profile.email || user.email || '' }, design: pd.design }));
  }, [user]);

  const pendingDraftRef = useRef<FormData | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [suspendAutosave, setSuspendAutosave] = useState(true);

  const isConfirmModalAllowed = useMemo(() => {
    const denyPaths = [/\/admin\/plan/i, /\/admin\/preview/i, /\/admin\/login/i, /\/admin\/posts(?:\/|$)/i];
    for (const rx of denyPaths) {
      if (rx.test(path)) return false;
    }
    const tab = searchParams?.get('tab') ?? '';
    const denyTabs = ['posts', 'subscribers', 'stats'];
    if (tab && denyTabs.includes(tab.toLowerCase())) return false;
    try {
      const disabled = localStorage.getItem('myeasypage:preview:disableDraftModal');
      if (disabled === '1') return false;
    } catch { }
    return true;
  }, [path, searchParams]);

  useEffect(() => {
    if (!userBootstrapped) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    let aborted = false;
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        const [pubRes, dr] = await Promise.all([
          getProfileDesignApi({ signal: ac.signal }).catch(() => null),
          typeof getProfileDesignDraftApi === 'function' ? getProfileDesignDraftApi().catch(() => null) : Promise.resolve(null),
        ]);
        if (aborted) return;

        const pubDoc = pubRes?.data ? (pubRes.data.profileDesign ?? pubRes.data) : null;
        const draftDoc = dr?.data ? (dr.data.draft ?? dr.data.profileDesign ?? dr.data) : null;

        const incomingProfile = (pubDoc?.profile ?? {}) as Partial<ProfileTabData>;
        const incomingDesign = (pubDoc?.design ?? {}) as Partial<FormData['design']>;
        const incomingSettings = (pubDoc?.settings ?? {}) as Partial<FormData['settings']>;
        setServerSnapshot({ profile: incomingProfile, design: incomingDesign, settings: incomingSettings });

        const publishedProfile = { ...EMPTY_PROFILE, ...(incomingProfile as any) } as FormData['profile'];
        const publishedDesign = { ...EMPTY_DESIGN, ...(incomingDesign as any) } as FormData['design'];
        const publishedSettings = { ...DEFAULT_SETTINGS, ...(incomingSettings as any) } as FormData['settings'];

        let draftProfile: Partial<FormData['profile']> | null = null;
        let draftDesign: Partial<FormData['design']> | null = null;
        let draftSettings: Partial<FormData['settings']> | null = null;
        let draftUpdatedAt = 0;
        let pubUpdatedAt = 0;

        if (draftDoc) {
          draftProfile = (draftDoc as any).profile ?? null;
          draftDesign = (draftDoc as any).design ?? null;
          draftSettings = (draftDoc as any).settings ?? null;
          draftUpdatedAt = (draftDoc as any).draftUpdatedAt
            ? Date.parse((draftDoc as any).draftUpdatedAt)
            : (draftDoc as any).updatedAt
              ? Date.parse((draftDoc as any).updatedAt)
              : 0;
        }
        if (pubDoc) {
          pubUpdatedAt = (pubDoc as any).updatedAt ? Date.parse((pubDoc as any).updatedAt) : 0;
        }

        const preferDraft = draftDoc && hasAnyData(draftDoc) && draftUpdatedAt > pubUpdatedAt;

        setProfileDesign({ profile: publishedProfile, design: publishedDesign });
        setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), ...(publishedSettings || {}) } as FormData['settings']));

        if (preferDraft && isConfirmModalAllowed) {
          pendingDraftRef.current = {
            profile: { ...EMPTY_PROFILE, ...(draftProfile as any) },
            design: { ...EMPTY_DESIGN, ...(draftDesign as any) },
            settings: { ...DEFAULT_SETTINGS, ...(draftSettings as any) },
          } as FormData;
          setSuspendAutosave(true);
          setConfirmOpen(true);
        } else {
          pendingDraftRef.current = null;
          setSuspendAutosave(false);
          loadedOnceRef.current = true;
        }

        setBootstrapped(true);
      } catch {
        const next = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
        router.push(`/login?next=${encodeURIComponent(next)}`);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      aborted = true;
      ac.abort();
    };
  }, [userBootstrapped, router, isConfirmModalAllowed]);

  const DELETE_KEYS = useMemo(
    () =>
      new Set<string>([
        'bannerImage',
        'bannerPublicId',
        'avatar',
        'avatarPublicId',
        'resumeUrl',
        'resumePublicId',
        'ogImage',
        'ogImagePublicId',
        'twitterImage',
        'twitterImagePublicId',
        'bio',
        'about',
        'fullName',
        'title',
        'email',
        'phone',
        'website',
        'whatsapp',
        'fullAddress',
        'latitude',
        'longitude',
        'emojiLink',
        'metaTitle',
        'metaDescription',
        'canonicalUrl',
        'ogTitle',
        'ogDescription',
        'twitterTitle',
        'twitterDescription',
      ]),
    []
  );

  const publishChanges = useCallback(async () => {
    try {
      const payload = {
        profile: cleanDeep(profileDesign.profile, DELETE_KEYS),
        design: cleanDeep(profileDesign.design, DELETE_KEYS),
        settings: cleanDeep(settings, DELETE_KEYS),
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
          const mergedSettings = { ...DEFAULT_SETTINGS, ...(incomingSettings as any) } as FormData['settings'];
          setProfileDesign({ profile: mergedProfile, design: mergedDesign });
          setSettings(mergedSettings);
        }
        setSuspendAutosave(false);
        showToast(res?.message || 'Published successfully!', 'success');
      } else {
        showToast(res?.message || 'Publish failed', 'error');
      }
      return res;
    } catch (err: any) {
      showToast(err?.message || 'Publish failed', 'error');
      throw err;
    }
  }, [profileDesign, settings, showToast, DELETE_KEYS]);

  const { saving: draftSaving, triggerSave: triggerDraftSave } = useAutoSaveDraft({
    profile: profileDesign.profile,
    design: profileDesign.design,
    settings,
    enabled: !suspendAutosave && dirty,
    debounceMs: 1200,
  });

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
      userEditedRef.current = true;
      setDirty(true);
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

  const wrapDirtyDispatch = <T,>(dispatch: React.Dispatch<React.SetStateAction<T>>): React.Dispatch<React.SetStateAction<T>> => {
    return (value) => {
      userEditedRef.current = true;
      setDirty(true);
      dispatch(value);
    };
  };

  usePreviewBus({ profile: profileDesign.profile, design: profileDesign.design } as FormData, plan);

  const handleLoadDraft = () => {
    const d = pendingDraftRef.current;
    if (!d) {
      setSuspendAutosave(false);
      setConfirmOpen(false);
      return;
    }
    setProfileDesign({ profile: { ...EMPTY_PROFILE, ...(d.profile as any) }, design: { ...EMPTY_DESIGN, ...(d.design as any) } });
    setSettings((prev) => ({ ...(prev || DEFAULT_SETTINGS), ...(d.settings as any) } as FormData['settings']));
    pendingDraftRef.current = null;
    setConfirmOpen(false);
    setDirty(false);
    setSuspendAutosave(false);
    triggerDraftSave();
    loadedOnceRef.current = true;
  };

  const handleKeepPublished = () => {
    pendingDraftRef.current = null;
    setConfirmOpen(false);
    setDirty(false);
    setSuspendAutosave(false);
    loadedOnceRef.current = true;
  };

  const contextValue = {
    form: composedForm,
    setForm,
    profileDesign,
    setProfileDesign: wrapDirtyDispatch(setProfileDesign),
    settings,
    setSettings: (next: Partial<FormData['settings']> | ((s: FormData['settings'] | undefined) => FormData['settings'])) => {
      userEditedRef.current = true;
      setDirty(true);
      if (typeof next === 'function') setSettings((s) => (next as any)(s));
      else setSettings((s) => ({ ...(s || DEFAULT_SETTINGS), ...(next || {}) } as FormData['settings']));
    },
    posts,
    setPosts: wrapDirtyDispatch<FormData['posts'] | undefined>(setPosts),
    subscriberSettings,
    setSubscriberSettings: wrapDirtyDispatch<FormData['subscriberSettings'] | undefined>(setSubscriberSettings),
    stats,
    setStats: wrapDirtyDispatch<FormData['stats'] | undefined>(setStats),
    plan,
    isLoading,
    bootstrapped,
    publishChanges,
    draftSaving,
    triggerDraftSave,
  };

  return (
    <AdminFormContext.Provider value={contextValue as any}>
      {isConfirmModalAllowed && (
        <ConfirmModal
          open={confirmOpen}
          onClose={handleKeepPublished}
          onConfirm={handleLoadDraft}
          title="Load autosaved draft?"
          message="We found an autosaved draft that is newer than your published content. Do you want to load the draft?"
          confirmLabel="Load Draft"
          cancelLabel="Keep Published"
          loading={false}
        />
      )}
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
