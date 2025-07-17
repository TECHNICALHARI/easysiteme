'use client';

import { useState } from 'react';
import styles from '@/styles/superadmin.module.css';
import StatCard from '@/lib/frontend/superadmin/StatCard';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#cbd5e1', '#60a5fa', '#8b5cf6'];

const dataByRange = {
    weekly: {
        stats: [
            { label: 'Total Users', value: '1,248', icon: '👥' },
            { label: 'Monthly Revenue', value: '₹42,750', icon: '💰' },
            { label: 'Active Subs', value: '823', icon: '📈' },
            { label: 'Signups Today', value: '37', icon: '🆕' },
        ],
        signupData: [
            { day: 'Mon', users: 12 },
            { day: 'Tue', users: 17 },
            { day: 'Wed', users: 30 },
            { day: 'Thu', users: 24 },
            { day: 'Fri', users: 42 },
            { day: 'Sat', users: 35 },
            { day: 'Sun', users: 26 },
        ],
        planData: [
            { name: 'Free', value: 210 },
            { name: 'Pro', value: 430 },
            { name: 'Premium', value: 608 },
        ],
    },
    monthly: {
        stats: [
            { label: 'Total Users', value: '3,740', icon: '👥' },
            { label: 'Monthly Revenue', value: '₹1,15,400', icon: '💰' },
            { label: 'Active Subs', value: '2,450', icon: '📈' },
            { label: 'Signups Today', value: '82', icon: '🆕' },
        ],
        signupData: [
            { day: 'Week 1', users: 750 },
            { day: 'Week 2', users: 930 },
            { day: 'Week 3', users: 1040 },
            { day: 'Week 4', users: 1020 },
        ],
        planData: [
            { name: 'Free', value: 1240 },
            { name: 'Pro', value: 1230 },
            { name: 'Premium', value: 1270 },
        ],
    },
    yearly: {
        stats: [
            { label: 'Total Users', value: '17,835', icon: '👥' },
            { label: 'Annual Revenue', value: '₹7,65,500', icon: '💰' },
            { label: 'Active Subs', value: '10,220', icon: '📈' },
            { label: 'Signups Today', value: '132', icon: '🆕' },
        ],
        signupData: [
            { day: 'Jan', users: 1480 },
            { day: 'Feb', users: 1380 },
            { day: 'Mar', users: 1550 },
            { day: 'Apr', users: 1340 },
            { day: 'May', users: 1710 },
            { day: 'Jun', users: 1280 },
            { day: 'Jul', users: 1450 },
        ],
        planData: [
            { name: 'Free', value: 5400 },
            { name: 'Pro', value: 6380 },
            { name: 'Premium', value: 6055 },
        ],
    },
    all: {
        stats: [
            { label: 'Total Users', value: '24,348', icon: '👥' },
            { label: 'Total Revenue', value: '₹12,52,600', icon: '💰' },
            { label: 'All-Time Subs', value: '11,800', icon: '📈' },
            { label: 'All-Time Signups', value: '28,750', icon: '🆕' },
        ],
        signupData: [
            { day: '2023', users: 10480 },
            { day: '2024', users: 13800 },
            { day: '2025', users: 14520 },
        ],
        planData: [
            { name: 'Free', value: 8000 },
            { name: 'Pro', value: 10200 },
            { name: 'Premium', value: 14120 },
        ],
    },
};

export default function AdminDashboardPage() {
    const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly' | 'all'>('weekly');

    const { stats, signupData, planData } = dataByRange[range];
    const activity = [
        'User jaseem upgraded to Premium',
        'Payment ₹499 received from priya',
        'New signup: dev@startups.io',
        'Raj edited profile bio',
        'Contact form submitted by ravi@xyz.com',
    ];

    return (
        <div className="grid gap-8">
            <div className="flex justify-between items-center">
                <h2 className={styles.pageTitle}>Super Admin Dashboard</h2>
                <div>
                    <select
                        className={styles.input}
                        value={range}
                        onChange={(e) => setRange(e.target.value as any)}
                    >
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                        <option value="yearly">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* 📊 Stats */}
            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 🎯 Pie Chart */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Plan Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={planData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                                }
                            >
                                {planData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 📈 Bar Chart */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>
                        {range === 'weekly'
                            ? 'Weekly Signups'
                            : range === 'monthly'
                                ? 'Monthly Signups'
                                : range === 'yearly'
                                    ? 'Yearly Signups'
                                    : 'All Time Signups'}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={signupData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 🕒 Activity Log */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Recent Activity</h3>
                <ul className={styles.activityList}>
                    {activity.map((log, i) => (
                        <li key={i} className={styles.activityItem}>
                            <span className="text-brand font-semibold mr-2">•</span>
                            {log}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
