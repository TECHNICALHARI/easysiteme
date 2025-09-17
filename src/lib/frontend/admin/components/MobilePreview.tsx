'use client';

import { useEffect, useMemo, useRef } from 'react';
import styles from '@/styles/admin.module.css';
import type { FormData } from '@/lib/frontend/types/form';

type Props = { form: FormData };

export default function MobilePreview({ form }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/admin/preview';
    return new URL('/admin/preview', window.location.origin).toString();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = () => {
      iframe.contentWindow?.postMessage(
        { type: 'myeasypage:preview:update', payload: form },
        '*',
      );
    };

    const onReady = (ev: MessageEvent) => {
      if (ev.source === iframe.contentWindow && ev.data?.type === 'myeasypage:preview:ready') {
        send();
      }
    };

    const onLoad = () => send();

    window.addEventListener('message', onReady);
    iframe.addEventListener('load', onLoad);

    send(); // first fire

    return () => {
      window.removeEventListener('message', onReady);
      iframe.removeEventListener('load', onLoad);
    };
  }, [form]);

  return (
    <div className={styles.deviceFrame}>
      <div className={styles.deviceInner}>
        <div className={styles.notch}>
          <span className={styles.cameraDot} />
          <span className={styles.speakerGrill} />
        </div>
        <div className={styles.btnLeftTop} />
        <div className={styles.btnLeftMid} />
        <div className={styles.btnRight} />
        <div className={styles.screen}>
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Mobile Preview"
            className={styles.screenContentIframe}
            style={{ border: 0 }}
          />
          <div className={styles.homeIndicator} />
        </div>
      </div>
      <div className={styles.deviceShadow} />
    </div>
  );
}
