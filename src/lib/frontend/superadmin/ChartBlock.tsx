'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import styles from '@/styles/superadmin.module.css';

const COLORS = ['#4f46e5', '#6366f1', '#a78bfa', '#34d399'];

export default function ChartBlock({
  title,
  type,
  data,
}: {
  title: string;
  type: 'pie' | 'area' | 'line';
  data: any[];
}) {
  return (
    <div className={styles.card}>
      <h4 className="text-md font-semibold mb-3">{title}</h4>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <RechartsTooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#areaColor)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
