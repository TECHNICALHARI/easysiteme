'use client';

import { useState } from 'react';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import CustomSelect from '@/lib/frontend/common/CustomSelect';
import CustomBarChart from '@/lib/frontend/common/charts/BarChart';
import CustomPieChart from '@/lib/frontend/common/charts/PieChart';
import LockedOverlay from '../../layout/LockedOverlay';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import styles from '@/styles/admin.module.css';

export default function StatsTab() {
  const { form, plan } = useAdminForm();
  const limits = PLAN_FEATURES[plan];
  const isStatsEnabled = limits?.stats;

  const stats = form.stats || {};

  const filterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 30 Days', value: '30days' },
  ];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

  const totalViews = (stats.trafficSources || []).reduce((sum, src) => sum + src.value, 0);
  const totalClicks = (stats.topLinks || []).reduce((sum, l) => sum + l.clicks, 0);
  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;

  const contactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'message', label: 'Message' },
    { key: 'submittedOn', label: 'Submitted On', sortable: true },
  ];

  const dynamicContentStats = [
    { section: 'FAQs', count: form.profile.faqs.length },
    { section: 'Testimonials', count: form.profile.testimonials.length },
    { section: 'Services', count: form.profile.services.length },
    { section: 'Embeds', count: form.profile.embeds.length },
    { section: 'Featured Media', count: form.profile.featured.length },
  ].filter((item) => item.count > 0);

  const dynamicSectionColumns = [
    { key: 'section', label: 'Section', sortable: true },
    { key: 'count', label: 'Items Count', sortable: true },
  ];

  return (
    <div className={styles.TabPageMain}>
      <div className={styles.sectionHead}>
        <h3>
          Stats & Insights <span className="badge-pro">Pro</span>
        </h3>
        <p>Monitor your performance: clicks, traffic, and engagement in real time.</p>
      </div>

      {isStatsEnabled && (
        <div className="flex justify-end mb-5">
          <div className="w-48">
            <CustomSelect
              options={filterOptions}
              value={selectedFilter}
              onChange={setSelectedFilter}
              placeholder="Select time"
            />
          </div>
        </div>
      )}

      <LockedOverlay enabled={isStatsEnabled} mode="overlay">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Link Click Analytics</h4>
            {stats.linkClicks && stats.linkClicks.length > 0 ? (
              <CustomBarChart data={stats.linkClicks} />
            ) : (
              <p className="text-sm text-muted">No link clicks yet.</p>
            )}
          </div>

          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Traffic Sources</h4>
            {stats.trafficSources && stats.trafficSources.length > 0 ? (
              <CustomPieChart data={stats.trafficSources} />
            ) : (
              <p className="text-sm text-muted">No traffic sources detected yet.</p>
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
          {stats.topLinks && stats.topLinks.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {stats.topLinks.map((link, i) => (
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
            <p className="text-sm text-muted">No top links available.</p>
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
          {stats.contactSubmissions && stats.contactSubmissions.length > 0 ? (
            <AdminTable columns={contactColumns} data={stats.contactSubmissions} />
          ) : (
            <p className="text-sm text-muted">No contact form submissions yet.</p>
          )}
        </div>
      </LockedOverlay>
    </div>
  );
}
