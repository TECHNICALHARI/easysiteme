'use client';

import { useEffect, useRef } from 'react';
import type { FormData } from '@/lib/frontend/types/form';
import { PlanType } from '@/config/PLAN_FEATURES';

const CACHE_KEY = 'myeasypage:preview:last';
const BUS_NAME = 'myeasypage:preview';

let sharedChannel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedChannel) sharedChannel = new BroadcastChannel(BUS_NAME);
    return sharedChannel;
  } catch {
    return null;
  }
}

function postAllTargets(payload: any) {
  try { window.parent?.postMessage(payload, '*'); } catch {}
  try { window.opener?.postMessage(payload, '*'); } catch {}
  try { window.postMessage(payload, '*'); } catch {}
}

type PreviewUpdate = {
  type: 'myeasypage:preview:update';
  payload: {
    form: FormData;
    plan: PlanType;
    previewMode: true;
  };
};

export function usePreviewBus(form: FormData, plan: PlanType) {
  const lastFormJson = useRef<string>('');
  const lastPlan = useRef<PlanType | null>(null);

  useEffect(() => {
    const formJson = JSON.stringify({ ...form, previewMode: true });
    if (formJson !== lastFormJson.current) {
      lastFormJson.current = formJson;
      try { localStorage.setItem(CACHE_KEY, formJson); } catch {}
    }

    if (formJson === lastFormJson.current && lastPlan.current === plan) return;
    lastPlan.current = plan;

    const message: PreviewUpdate = {
      type: 'myeasypage:preview:update',
      payload: { form, plan, previewMode: true as const },
    };

    try { getChannel()?.postMessage(message); } catch {}
    postAllTargets(message);
  }, [form, plan]);

  useEffect(() => {
    postAllTargets({ type: 'myeasypage:preview:ping' });
  }, []);
}
