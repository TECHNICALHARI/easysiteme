'use client';

import { useState } from 'react';
import { Eye, X } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import MobilePreview from '@/lib/frontend/admin/components/MobilePreview';
import AllTabs from '@/lib/frontend/admin/components/AllTabs';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';

export default function Dashboard() {
  const { form } = useAdminForm();

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        <div className={styles.mobilePreview}>
          <MobilePreview form={form} />
        </div>

        <div className={styles.pageContainer}>
          <div className={styles.dashboard_mainRapper}>
            <AllTabs />
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open Preview"
        title="Open Preview"
        className={styles.previewFab}
        onClick={() => setShowPreview(true)}
      >
        Open Preview
        <Eye size={18} />
      </button>

      {showPreview && (
        <div className={styles.previewModal} role="dialog" aria-modal="true">
          <div className={styles.previewModalContent}>
            <button
              type="button"
              aria-label="Close Preview"
              className={styles.previewClose}
              onClick={() => setShowPreview(false)}
            >
              <X size={18} />
            </button>

            <div className={styles.previewModalBody}>
              <MobilePreview form={form} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
