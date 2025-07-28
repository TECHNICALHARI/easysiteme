'use client';

import styles from '@/styles/admin.module.css';
import { useAutoSave } from '@/lib/frontend/hooks/useAutoSave';
import MobilePreview from '@/lib/frontend/admin/components/MobilePreview';
import AllTabs from '@/lib/frontend/admin/components/AllTabs';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';

export default function Dashboard() {
  const { form, setForm } = useAdminForm();
  useAutoSave(form);

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        <div className={styles.mobilePreview}>
          <div className={styles.phoneFrame}>
            <MobilePreview form={form} />
          </div>
        </div>
        <div className={styles.pageContainer}>
          <div className={styles.dashboard_mainRapper}>
            <AllTabs form={form} setForm={setForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
