'use client';

import { FC, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { FormData } from '../../types/form';
const tabs = ['Links', 'Posts', 'Design', 'Subscribers', 'Stats', 'Settings'];

interface props {
    form: FormData;
    setForm: React.Dispatch<React.SetStateAction<FormData>>;
}
const AllTabs: FC<props> = ({ form, setForm }) => {
    const [activeTab, setActiveTab] = useState('Links');

    return (
        <div className={styles.tabsWrapper}>
            <nav className={styles.tabNav}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className={styles.tabContent}>
                {/* {activeTab === 'Links' && <LinksTab form={form} setForm={setForm} />}
        {activeTab === 'Posts' && <PostsTab form={form} setForm={setForm} />}
        {activeTab === 'Design' && <DesignTab form={form} setForm={setForm} />}
        {activeTab === 'Subscribers' && <SubscribersTab form={form} setForm={setForm} />}
        {activeTab === 'Stats' && <StatsTab form={form} setForm={setForm} />}
        {activeTab === 'Settings' && <SettingsTab form={form} setForm={setForm} />} */}
            </div>
        </div>
    );
}

export default AllTabs;