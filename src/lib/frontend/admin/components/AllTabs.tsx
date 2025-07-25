'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/styles/admin.module.css';
import { FormData } from '../../types/form';
import ProfileTab from './profile/ProfileTab';
import PostTab from './posts/PostTab';

const tabs = ['Profile', 'Posts', 'Design', 'Subscribers', 'Stats', 'Settings'];

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const AllTabs: FC<Props> = ({ form, setForm }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'Profile');

  // Sync query with state
  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
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
        {activeTab === 'Profile' && <ProfileTab form={form} setForm={setForm} />}
        {activeTab === 'Posts' && <PostTab />}
        {/* Uncomment others as needed */}
        {/* {activeTab === 'Design' && <DesignTab form={form} setForm={setForm} />} */}
        {/* {activeTab === 'Subscribers' && <SubscribersTab form={form} setForm={setForm} />} */}
        {/* {activeTab === 'Stats' && <StatsTab form={form} setForm={setForm} />} */}
        {/* {activeTab === 'Settings' && <SettingsTab form={form} setForm={setForm} />} */}
      </div>
    </div>
  );
};

export default AllTabs;
