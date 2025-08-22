'use client';

import { useEffect, useRef } from 'react';
import type { FormData } from '@/lib/frontend/types/form';

const DRAFT_VERSION = 'v2';
const KEY = `onepage:form:draft:${DRAFT_VERSION}`;

export function loadDraft(): Partial<FormData> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<FormData>;
  } catch {
    return null;
  }
}

export function useLocalDraft(form: FormData, enabled: boolean) {
  const first = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(form));
    } catch {}
  }, [enabled, form]);
}
