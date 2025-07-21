'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import styles from "@/styles/modal.module.css"

export default function Modal({
    children,
    onClose,
    width = '720px',
    title,
    noPadding
}: {
    children: ReactNode;
    onClose: () => void;
    width?: string;
    title?: string;
    noPadding?: boolean;
}) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.customModal} style={{ maxWidth: width }}>
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <main className={`${styles.modalBody} ${noPadding ? styles.noPadding : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
