'use client';

import { useState, useEffect } from 'react';
import CustomSelect from '@/lib/frontend/common/CustomSelect';
import CustomBarChart from '@/lib/frontend/common/charts/BarChart';
import CustomPieChart from '@/lib/frontend/common/charts/PieChart';
import LockedOverlay from '../../layout/LockedOverlay';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import { PLAN_FEATURES, PlanType } from '@/config/PLAN_FEATURES';
import styles from '@/styles/admin.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { getStatsServiceAPI } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';

export default function StatsTab() {
  const { profileDesign, stats, plan, setStats } = useAdminForm() as {
    profileDesign: any;
    stats: any;
    plan: PlanType;
    setStats: (s: any) => void;
  };
  const { showToast } = useToast();
  const limits = PLAN_FEATURES[plan];
  const isStatsEnabled = Boolean(limits?.stats);

  const profile = profileDesign?.profile || {};

  const statsData = stats || {};

  const filterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 30 Days', value: '30days' },
  ];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);
  const [loading, setLoading] = useState(false);

  const totalViews = (statsData.trafficSources || []).reduce((sum: number, src: any) => sum + (src?.value || 0), 0);
  const totalClicks = (statsData.topLinks || []).reduce((sum: number, l: any) => sum + (l?.clicks || 0), 0);
  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;

  const contactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'message', label: 'Message' },
    { key: 'submittedOn', label: 'Submitted On', sortable: true },
  ];

  const dynamicContentStats = [
    { section: 'FAQs', count: (profile.faqs || []).length },
    { section: 'Testimonials', count: (profile.testimonials || []).length },
    { section: 'Services', count: (profile.services || []).length },
    { section: 'Embeds', count: (profile.embeds || []).length },
    { section: 'Featured Media', count: (profile.featured || []).length },
  ].filter((item) => item.count > 0);

  const dynamicSectionColumns = [
    { key: 'section', label: 'Section', sortable: true },
    { key: 'count', label: 'Items Count', sortable: true },
  ];

  async function fetchStats() {
    if (!isStatsEnabled) return;
    try {
      setLoading(true);
      const res = await getStatsServiceAPI();
      if (!res || !res.success) throw new Error(res?.message || 'Failed to fetch stats');
      const payload = res.data ?? res?.data?.stats ?? res?.data ?? {};
      setStats(payload);
    } catch (err: any) {
      showToast(err?.message || 'Failed to load stats', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  return (
    <div className={styles.TabPageMain}>
      <div className={styles.sectionHead}>
        <h3>
          Stats & Insights <span className="badge-pro">Pro</span>
        </h3>
        <p>Monitor your performance: clicks, traffic, and engagement in real time.</p>
      </div>

      {isStatsEnabled && (
        <div className="flex justify-between mb-5 items-center">
          <div className="w-48">
            <CustomSelect
              options={filterOptions}
              value={selectedFilter}
              onChange={setSelectedFilter}
              placeholder="Select time"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              onClick={fetchStats}
              disabled={loading}
              type="button"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      )}

      <LockedOverlay enabled={isStatsEnabled} mode="overlay">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Link Click Analytics</h4>
            {statsData.linkClicks && statsData.linkClicks.length > 0 ? (
              <CustomBarChart data={statsData.linkClicks} />
            ) : (
              <p className="text-sm text-muted">{loading ? 'Loading...' : 'No link clicks yet.'}</p>
            )}
          </div>

          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Traffic Sources</h4>
            {statsData.trafficSources && statsData.trafficSources.length > 0 ? (
              <CustomPieChart data={statsData.trafficSources} />
            ) : (
              <p className="text-sm text-muted">{loading ? 'Loading...' : 'No traffic sources detected yet.'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
            <h4>Views</h4>
            <p>{totalViews}</p>
          </div>
          <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
            <h4>Clicks</h4>
            <p>{totalClicks}</p>
          </div>
          <div className={`${styles.sectionMain} ${styles.subscribeCard}`}>
            <h4>CTR</h4>
            <p>{ctr}%</p>
          </div>
        </div>

        <div className={styles.sectionMain}>
          <h4 className="text-base font-semibold mb-3">Top Links</h4>
          {statsData.topLinks && statsData.topLinks.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {statsData.topLinks.map((link: any, i: number) => (
                <li key={i} className="border p-3 rounded-md">
                  <div className="flex justify-between items-center font-medium">
                    <div>
                      {i + 1}. {link.title}
                      <p className="text-muted text-xs mt-1">{link.url}</p>
                    </div>
                    <div className="text-brand font-semibold text-sm">
                      {link.clicks} {link.clicks > 1 ? 'clicks' : 'click'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">{loading ? 'Loading...' : 'No top links available.'}</p>
          )}
        </div>

        <div className={styles.sectionMain}>
          <h4 className="text-base font-semibold mb-3">Content Blocks Added</h4>
          {dynamicContentStats.length > 0 ? (
            <AdminTable columns={dynamicSectionColumns} data={dynamicContentStats} />
          ) : (
            <p className="text-sm text-muted">No content blocks added yet.</p>
          )}
        </div>

        <div className={styles.sectionMain}>
          <h4 className="text-base font-semibold mb-3">Contact Form Submissions</h4>
          {statsData.contactSubmissions && statsData.contactSubmissions.length > 0 ? (
            <AdminTable columns={contactColumns} data={statsData.contactSubmissions} />
          ) : (
            <p className="text-sm text-muted">{loading ? 'Loading...' : 'No contact form submissions yet.'}</p>
          )}
        </div>
      </LockedOverlay>
    </div>
  );
}
