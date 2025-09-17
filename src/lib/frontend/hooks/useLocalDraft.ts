'use client';

import { useEffect, useRef } from 'react';
import type { FormData } from '@/lib/frontend/types/form';

const DRAFT_VERSION = 'v3';
const KEY = `myeasypage:form:draft:${DRAFT_VERSION}`;

const EDITABLE_KEYS: (keyof FormData)[] = [
  'profile',
  'design',
  'seo',
  'settings',
  'socials',
  'posts',
  'subscriberSettings',
  'stats',
];

export function loadDraft(): Partial<FormData> | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Partial<FormData>;
  } catch {
    return undefined;
  }
}

export function useLocalDraft(form: FormData, enabled: boolean, serverData?: Partial<FormData>) {
  const first = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }

    try {
      const editableDraft: Partial<FormData> = {};

      EDITABLE_KEYS.forEach((key) => {
        const current = form[key];
        const server = serverData?.[key];

        if (JSON.stringify(current) !== JSON.stringify(server)) {
          (editableDraft as any)[key] = current;
        }
      });

      if (Object.keys(editableDraft).length > 0) {
        localStorage.setItem(KEY, JSON.stringify(editableDraft));
      }
    } catch {}
  }, [enabled, form, serverData]);
}
