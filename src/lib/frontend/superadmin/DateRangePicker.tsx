'use client';

import { CalendarDays } from 'lucide-react';
import { useRef } from 'react';

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: [Date | null, Date | null];
  onChange: (val: [Date | null, Date | null]) => void;
}) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  return (
    <div className="date-range-wrapper">
      <label className="date-label">
        <CalendarDays size={16} className="date-icon" />
        <input
          ref={fromRef}
          type="date"
          value={value[0]?.toISOString().split('T')[0] || ''}
          onChange={(e) =>
            onChange([new Date(e.target.value), value[1]])
          }
        />
      </label>
      <span className="date-separator">to</span>
      <label className="date-label">
        <CalendarDays size={16} className="date-icon" />
        <input
          ref={toRef}
          type="date"
          value={value[1]?.toISOString().split('T')[0] || ''}
          onChange={(e) =>
            onChange([value[0], new Date(e.target.value)])
          }
        />
      </label>
    </div>
  );
}
