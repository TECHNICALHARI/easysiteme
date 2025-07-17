'use client';

import { useState } from 'react';
import styles from '@/styles/superadmin.module.css';
import PlanFilter from '@/lib/frontend/superadmin/PlanFilter';
import DateRangePicker from '@/lib/frontend/superadmin/DateRangePicker';
import ChartBlock from '@/lib/frontend/superadmin/ChartBlock';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

const rawReports = [
  {
    name: 'Monthly User Growth',
    type: 'CSV',
    date: '2025-07-10',
    status: 'Completed',
  },
  {
    name: 'Revenue by Plan',
    type: 'Excel',
    date: '2025-07-08',
    status: 'Completed',
  },
  {
    name: 'Refund Reports',
    type: 'PDF',
    date: '2025-07-05',
    status: 'Pending',
  },
  {
    name: 'Engagement Metrics',
    type: 'CSV',
    date: '2025-07-01',
    status: 'Completed',
  },
];

export default function ReportsPage() {
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const columns = [
    { key: 'name', label: 'Report Name', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Generated On', sortable: true },
    { key: 'status', label: 'Status' },
  ];

  const filtered = rawReports.filter((report) => {
    const planMatch = planFilter === 'All' || report.name.toLowerCase().includes(planFilter.toLowerCase());
    const date = new Date(report.date);
    const from = dateRange[0];
    const to = dateRange[1];
    const dateMatch =
      (!from || date >= from) &&
      (!to || date <= to);
    return planMatch && dateMatch;
  });

  const exportCSV = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = filtered.map(r => [r.name, r.type, r.date, r.status].join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reports.csv');
  };

  const exportExcel = () => {
    const headers = columns.map(c => c.label).join('\t');
    const rows = filtered.map(r => [r.name, r.type, r.date, r.status].join('\t')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'application/vnd.ms-excel' });
    saveAs(blob, 'reports.xls');
  };

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.screenHeader}>
        <h2 className={styles.screenTitle}>Reports & Analytics</h2>
        <div className="flex gap-3">
          <PlanFilter value={planFilter} onChange={setPlanFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {[
          ['Total Users', 2150],
          ['Active Subscriptions', 1023],
          ['Monthly Revenue', '₹48,230'],
          ['Refunds Issued', '₹2,300'],
        ].map(([label, value], i) => (
          <div key={i} className={styles.statCard}>
            <p className={styles.statLabel}>{label}</p>
            <h4 className={styles.statValue}>{value}</h4>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <ChartBlock
          title="User Growth"
          type="line"
          data={[
            { date: '2025-07-01', value: 40 },
            { date: '2025-07-05', value: 80 },
            { date: '2025-07-10', value: 130 },
            { date: '2025-07-15', value: 175 },
            { date: '2025-07-20', value: 200 },
          ]}
        />
        <ChartBlock
          title="Revenue Over Time"
          type="area"
          data={[
            { date: '2025-07-01', value: 500 },
            { date: '2025-07-05', value: 1000 },
            { date: '2025-07-10', value: 1600 },
            { date: '2025-07-15', value: 2400 },
            { date: '2025-07-20', value: 3300 },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <ChartBlock
          title="Plan Distribution"
          type="pie"
          data={[
            { name: 'Free', value: 1120 },
            { name: 'Pro', value: 820 },
            { name: 'Premium', value: 210 },
          ]}
        />
        <ChartBlock
          title="Engagement Breakdown"
          type="pie"
          data={[
            { name: 'Posts', value: 342 },
            { name: 'Subscribers', value: 184 },
            { name: 'Links Clicked', value: 502 },
          ]}
        />
      </div>

      {/* Reports Table */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-brand">Generated Reports</h3>
          <div className="flex gap-3">
            <button onClick={exportCSV} className={styles.exportBtn}>
              <Download size={16} />
              Export CSV
            </button>
            <button onClick={exportExcel} className={styles.exportBtn}>
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filtered}
          enablePagination
        //   enableSorting
          defaultPageSize={10}
        />
      </div>
    </div>
  );
}
