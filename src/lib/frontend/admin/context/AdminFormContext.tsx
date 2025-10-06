'use client';

import { createContext, useContext } from 'react';
import type { FormData } from '@/lib/frontend/types/form';
import { PlanType } from '@/config/PLAN_FEATURES';

export type ProfileDesignSlice = {
  profile: FormData['profile'];
  design: FormData['design'];
};

export type AdminFormContextType = {
  form: FormData;
  setForm: (next: FormData | ((p: FormData) => FormData)) => void;
  profileDesign: ProfileDesignSlice;
  setProfileDesign: (next: Partial<ProfileDesignSlice> | ((p: ProfileDesignSlice) => ProfileDesignSlice)) => void;
  settings: FormData['settings'];
  setSettings: (next: Partial<FormData['settings']> | ((s: FormData['settings']) => FormData['settings'])) => void;
  posts: FormData['posts'];
  setPosts: (next: FormData['posts'] | ((p: FormData['posts']) => FormData['posts'])) => void;
  subscriberSettings: FormData['subscriberSettings'];
  setSubscriberSettings: (next: FormData['subscriberSettings'] | ((p: FormData['subscriberSettings']) => FormData['subscriberSettings'])) => void;
  stats: FormData['stats'];
  setStats: (next: FormData['stats'] | ((p: FormData['stats']) => FormData['stats'])) => void;
  plan: PlanType;
  isLoading: boolean;
  bootstrapped: boolean;
};

export const AdminFormContext = createContext<AdminFormContextType>({
  form: {} as FormData,
  setForm: () => { },
  profileDesign: { profile: {} as any, design: {} as any },
  setProfileDesign: () => { },
  settings: {} as any,
  setSettings: () => { },
  posts: { posts: [] },
  setPosts: () => { },
  subscriberSettings: { SubscriberList: { data: [], total: 0, active: 0, unsubscribed: 0 }, subscriberSettings: { hideSubscribeButton: false, subject: '', thankYouMessage: '' } },
  setSubscriberSettings: () => { },
  stats: { linkClicks: [], trafficSources: [], contactSubmissions: [], topLinks: [] },
  setStats: () => { },
  plan: 'free',
  isLoading: true,
  bootstrapped: false,
});

export const useAdminForm = () => useContext(AdminFormContext);
