'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: { label: string; value: number }[];
}

export default function CustomBarChart({ data }: BarChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
