'use client';

import React, { useEffect, useRef } from 'react';
import styles from '@/styles/modal.module.css';

type Props = {
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => Promise<void> | void;
    onClose: () => void;
    width?: string;
};

export default function ConfirmModal({
    open,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    loading = false,
    onConfirm,
    onClose,
    width = '520px',
}: Props) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const confirmRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const prevActive = document.activeElement as HTMLElement | null;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter') {
                if (!loading) onConfirm();
            }
        };
        document.addEventListener('keydown', onKey);
        confirmRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            prevActive?.focus();
        };
    }, [open, onClose, onConfirm, loading]);

    if (!open) return null;

    return (
        <div className={styles.pmOverlay} ref={overlayRef} role="dialog" aria-modal="true" aria-labelledby="pm-title">
            <div className={styles.pmCard} style={{ maxWidth: width }}>
                <header className={styles.pmHeader}>
                    <h3 id="pm-title" className={styles.pmTitle}>
                        {title}
                    </h3>
                    <button className={styles.pmClose} onClick={onClose} aria-label="Close" type="button">
                        ✕
                    </button>
                </header>

                <div className={styles.pmBody}>
                    <div className={styles.pmIconWrap} aria-hidden>
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="24" cy="24" r="23" stroke="rgba(16,24,40,0.08)" strokeWidth="2" fill="white" />
                            <path d="M24 12V26" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="24" cy="34" r="1.6" fill="var(--color-brand)" />
                        </svg>
                    </div>
                    <div className={styles.pmTexts}>
                        <p className={styles.pmMessage}>{message}</p>
                    </div>
                </div>

                <footer className={styles.pmFooter}>
                    <button className={`${styles.pmBtn} ${styles.pmBtnGhost}`} onClick={onClose} disabled={loading} type="button">
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        className={`${styles.pmBtn} ${styles.pmBtnDanger}`}
                        onClick={async () => {
                            await onConfirm();
                        }}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? <span className={styles.pmSpinner} aria-hidden /> : null}
                        <span className={styles.pmBtnLabel}>{loading ? 'Processing…' : confirmLabel}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
}
