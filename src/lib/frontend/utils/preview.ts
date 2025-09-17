'use client';

import type { FormData } from '@/lib/frontend/types/form';

const BUS_NAME = 'myeasypage:preview';
const CACHE_KEY = 'myeasypage:preview:last';

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

function syncPreviewPayload(form: FormData) {
  const payload = { ...form, previewMode: true };
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
  try { getChannel()?.postMessage({ type: 'myeasypage:preview:update', payload: form }); } catch {}
  try { window.parent?.postMessage({ type: 'myeasypage:preview:update', payload: form }, '*'); } catch {}
  try { window.opener?.postMessage({ type: 'myeasypage:preview:update', payload: form }, '*'); } catch {}
  try { window.postMessage({ type: 'myeasypage:preview:update', payload: form }, '*'); } catch {}
}

export function openPreviewInNewTab(form: FormData) {
  // important: no 'noreferrer' so window ref available रहे
  const w = window.open('/admin/preview', '_blank', 'noopener');
  // immediately broadcast + cache
  syncPreviewPayload(form);
  try { w?.postMessage({ type: 'myeasypage:preview:update', payload: form }, '*'); } catch {}
}

export function pingPreview() {
  try { window.parent?.postMessage({ type: 'myeasypage:preview:ping' }, '*'); } catch {}
  try { window.opener?.postMessage({ type: 'myeasypage:preview:ping' }, '*'); } catch {}
  try { window.postMessage({ type: 'myeasypage:preview:ping' }, '*'); } catch {}
}

export function usePreviewHotkey(form: FormData) {
  // Meta+Shift+P / Ctrl+Shift+P -> open preview (Ctrl+P से print खुलता है, इसलिए shift जोड़ा है)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useEffect } = require('react') as typeof import('react');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        openPreviewInNewTab(form);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [form]);
}
