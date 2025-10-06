'use client';

import { useEffect, useRef } from 'react';
import type { FormData } from '@/lib/frontend/types/form';

const DRAFT_VERSION = 'v4';
const KEY = `myeasypage:form:draft:${DRAFT_VERSION}`;

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

      const currentProfile = form.profile;
      const serverProfile = serverData?.profile;
      const currentDesign = form.design;
      const serverDesign = serverData?.design;

      if (JSON.stringify(currentProfile) !== JSON.stringify(serverProfile)) {
        editableDraft.profile = currentProfile;
      }
      if (JSON.stringify(currentDesign) !== JSON.stringify(serverDesign)) {
        editableDraft.design = currentDesign;
      }

      if (Object.keys(editableDraft).length > 0) {
        localStorage.setItem(KEY, JSON.stringify(editableDraft));
      }
    } catch {
      // ignore
    }
  }, [enabled, form, serverData]);
}
