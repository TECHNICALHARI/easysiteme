'use client';
export default function PlanFilter({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-brand focus:border-brand"
    >
      <option value="All">All Plans</option>
      <option value="Free">Free</option>
      <option value="Pro">Pro</option>
      <option value="Premium">Premium</option>
    </select>
  );
}
