'use client';

import { useState, useMemo } from 'react';
import styles from '@/styles/superadmin.module.css';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import PlanFilter from '@/lib/frontend/superadmin/PlanFilter';
import DateRangePicker from '@/lib/frontend/superadmin/DateRangePicker';
import ChartBlock from '@/lib/frontend/superadmin/ChartBlock';
import { Download } from 'lucide-react';

// 🧪 Full Payments Dataset
const paymentsData = [
  { id: '1', name: 'Aman Verma', email: 'aman@gmail.com', plan: 'Pro', amount: 199, date: '2025-07-10', status: 'Success' },
  { id: '2', name: 'Riya Sharma', email: 'riya@gmail.com', plan: 'Premium', amount: 499, date: '2025-07-08', status: 'Success' },
  { id: '3', name: 'John Singh', email: 'john@gmail.com', plan: 'Free', amount: 0, date: '2025-07-01', status: 'Free' },
  { id: '4', name: 'Tina Roy', email: 'tina@gmail.com', plan: 'Premium', amount: 499, date: '2025-07-11', status: 'Refunded' },
  { id: '5', name: 'Mohit Sinha', email: 'mohit@gmail.com', plan: 'Pro', amount: 199, date: '2025-07-03', status: 'Success' },
  { id: '6', name: 'Priya Mehta', email: 'priya@gmail.com', plan: 'Pro', amount: 199, date: '2025-07-07', status: 'Success' },
  { id: '7', name: 'Dev Sharma', email: 'dev@gmail.com', plan: 'Free', amount: 0, date: '2025-07-05', status: 'Free' },
  { id: '8', name: 'Neha Gupta', email: 'neha@gmail.com', plan: 'Premium', amount: 499, date: '2025-07-09', status: 'Cancelled' },
];

const columns = [
  { key: 'name', label: 'User', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan', sortable: true },
  { key: 'amount', label: 'Amount (₹)', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

export default function PaymentsPage() {
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const filtered = useMemo(() => {
    return paymentsData.filter((p) => {
      const matchesPlan = planFilter === 'All' || p.plan === planFilter;
      const matchesDate =
        (!dateRange[0] || new Date(p.date) >= dateRange[0]) &&
        (!dateRange[1] || new Date(p.date) <= dateRange[1]);
      return matchesPlan && matchesDate;
    });
  }, [planFilter, dateRange]);

  // 🔢 Totals
  const monthlyRevenue = useMemo(() => {
    return filtered
      .filter((p) => p.status === 'Success')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [filtered]);

  const activeSubscriptions = useMemo(() => {
    return filtered.filter((p) => p.status === 'Success' && p.plan !== 'Free').length;
  }, [filtered]);

  // 📊 Charts
  const revenueByPlan = useMemo(() => {
    const totals: Record<string, number> = { Free: 0, Pro: 0, Premium: 0 };
    filtered.forEach((p) => (totals[p.plan] += p.amount));
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((p) => {
      const date = p.date;
      map.set(date, (map.get(date) || 0) + p.amount);
    });
    return Array.from(map.entries()).map(([date, value]) => ({ date, value }));
  }, [filtered]);

  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = { Success: 0, Refunded: 0, Cancelled: 0, Free: 0 };
    filtered.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // 📤 Export to CSV
  const exportCSV = () => {
    const header = columns.map(c => c.label).join(',');
    const rows = filtered.map((p) =>
      [p.name, p.email, p.plan, p.amount, p.date, p.status].join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.screenWrapper}>
      {/* 🔢 Summary */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className={styles.metricCard}>
          <h4>Monthly Revenue</h4>
          <p className={styles.metricValue}>₹{monthlyRevenue.toLocaleString()}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Active Subscriptions</h4>
          <p className={styles.metricValue}>{activeSubscriptions}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.screenHeader}>
        <h2 className={styles.screenTitle}>Payments & Transactions</h2>
        <div className="flex gap-3">
          <PlanFilter value={planFilter} onChange={setPlanFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <button
            onClick={exportCSV}
            className={`${styles.btnSecondary} flex items-center gap-2`}
            title="Download CSV"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <ChartBlock title="Revenue by Plan" type="pie" data={revenueByPlan} />
        <ChartBlock title="Revenue Over Time" type="area" data={revenueByDate} />
        <ChartBlock title="Status Breakdown" type="pie" data={statusPieData} />
      </div>

      {/* Table */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-brand">Transaction History</h3>
        <AdminTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
