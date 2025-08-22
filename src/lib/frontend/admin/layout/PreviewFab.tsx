'use client';

import { Eye } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { openPreviewInNewTab } from '../../utils/preview';

export default function PreviewFab() {
    const { form } = useAdminForm();

    return (
        <button
            type="button"
            className={styles.previewFabGlobal}
            aria-label="Live Preview (Meta/Ctrl+Shift+P)"
            title="Live Preview (Meta/Ctrl+Shift+P)"
            onClick={() => openPreviewInNewTab(form)}
        >
            <Eye size={18} aria-hidden="true" />
            <span className={styles.previewFabLabel}>Preview</span>
            <kbd className={styles.previewFabShortcut}>⇧ + P</kbd>
        </button>
    );
}
