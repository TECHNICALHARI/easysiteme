'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/styles/admin.module.css';
import ProfileTab from './profile/ProfileTab';
import PostTab from './posts/PostTab';
import DesignTab from './design/DesignTab';
import SubscribersTab from './subscribers/SubscribersTab';
import StatsTab from './stats/StatsTab';
import SettingsTab from './setting/SettingsTab';

const tabs = ['Profile', 'Posts', 'Design', 'Subscribers', 'Stats', 'Settings'];

const AllTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams.get('tab') || undefined;
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'Profile');

  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    router.push(url.toString(), { scroll: false });
  };

  return (
    <div className={styles.tabsWrapper}>
      <nav className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'Profile' && <ProfileTab />}
        {activeTab === 'Posts' && <PostTab />}
        {activeTab === 'Design' && <DesignTab />}
        {activeTab === 'Subscribers' && <SubscribersTab />}
        {activeTab === 'Stats' && <StatsTab />}
        {activeTab === 'Settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default AllTabs;
