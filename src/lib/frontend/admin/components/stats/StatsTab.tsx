'use client';

import { useState } from 'react';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import CustomSelect from '@/lib/frontend/common/CustomSelect';
import CustomBarChart from '@/lib/frontend/common/charts/BarChart';
import CustomPieChart from '@/lib/frontend/common/charts/PieChart';
import LockedOverlay from '../../layout/LockedOverlay';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import styles from '@/styles/admin.module.css';

const StatsTab = () => {
  const { form } = useAdminForm();
  const { profile } = form;

  const filterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 30 Days', value: '30days' },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

  const linkClicks = [
    { label: 'Instagram', value: 134 },
    { label: 'Portfolio', value: 90 },
    { label: 'YouTube', value: 72 },
  ];

  const trafficSources = [
    { label: 'Direct', value: 110 },
    { label: 'bio.link', value: 40 },
    { label: 'Google Search', value: 30 },
    { label: 'Twitter', value: 20 },
  ];

  const contactSubmissions = [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: 'I’m interested in your services.',
      submittedOn: '2025-07-20',
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      message: 'Do you offer group sessions?',
      submittedOn: '2025-07-22',
    },
  ];

  const topLinks = [
    { title: 'Instagram', url: 'https://instagram.com', clicks: 134 },
    { title: 'Portfolio', url: 'https://myportfolio.com', clicks: 90 },
    { title: 'YouTube Channel', url: 'https://youtube.com', clicks: 72 },
  ];

  const dynamicContentStats = [
    { section: 'FAQs', count: profile.faqs.length },
    { section: 'Testimonials', count: profile.testimonials.length },
    { section: 'Services', count: profile.services.length },
    { section: 'Embeds', count: profile.embeds.length },
    { section: 'Featured Media', count: profile.featured.length },
  ].filter((item) => item.count > 0);

  const totalViews = trafficSources.reduce((sum, src) => sum + src.value, 0);
  const totalClicks = topLinks.reduce((sum, l) => sum + l.clicks, 0);
  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;

  const contactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'message', label: 'Message' },
    { key: 'submittedOn', label: 'Submitted On', sortable: true },
  ];

  const dynamicSectionColumns = [
    { key: 'section', label: 'Section', sortable: true },
    { key: 'count', label: 'Items Count', sortable: true },
  ];

  return (
    <div className={styles.TabPageMain}>
      <div className={styles.sectionHead}>
        <h3>Stats & Insights</h3>
        <p>Monitor performance, clicks, traffic, and content interactions.</p>
      </div>

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

      <LockedOverlay enabled={true}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Link Click Analytics</h4>
            <CustomBarChart data={linkClicks} />
          </div>
          <div className={styles.sectionMain}>
            <h4 className="font-semibold mb-3">Traffic Sources</h4>
            <CustomPieChart data={trafficSources} />
          </div>
        </div>
      </LockedOverlay>

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
        <ul className="space-y-3 text-sm">
          {topLinks.map((link, i) => (
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
      </div>

      {dynamicContentStats.length > 0 && (
        <LockedOverlay enabled={true}>
          <div className={styles.sectionMain}>
            <h4 className="text-base font-semibold mb-3">Content Blocks Added</h4>
            <AdminTable columns={dynamicSectionColumns} data={dynamicContentStats} />
          </div>
        </LockedOverlay>
      )}

      {contactSubmissions.length > 0 && (
        <LockedOverlay enabled={true}>
          <div className={styles.sectionMain}>
            <h4 className="text-base font-semibold mb-3">Contact Form Submissions</h4>
            <AdminTable columns={contactColumns} data={contactSubmissions} />
          </div>
        </LockedOverlay>
      )}
    </div>
  );
};

export default StatsTab;
