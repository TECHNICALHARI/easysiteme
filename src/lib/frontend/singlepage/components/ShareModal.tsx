'use client';

import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import styles from '@/styles/preview.module.css';

export default function ShareModal({
  open,
  onClose,
  url,
  title = 'Share this profile',
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    url
  )}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.customModal}>
        <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-6 mt-3">
          <div className="flex items-center justify-center">
            <img
              src={qrSrc}
              alt="Profile QR"
              width={220}
              height={220}
              className="rounded-xl border border-[var(--color-muted)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-sm text-[var(--color-text-muted)]">
              Scan the code or copy the link to share.
            </div>
            <div className="flex items-stretch gap-2">
              <input className="input flex-1" value={url} readOnly />
              <button className="btn-primary flex items-center gap-2" onClick={onCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
