'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/styles/table.module.css';
import AdminPagination from './AdminPagination';

type Column = {
  key: string;
  label: string;
  sortable?: boolean;
};

type Props = {
  columns: Column[];
  data: any[];
  enablePagination?: boolean;
  defaultPageSize?: number;
  renderActions?: (row: any, index: number) => React.ReactNode;
};

export default function AdminTable({
  columns,
  data,
  enablePagination = true,
  defaultPageSize = 10,
  renderActions,
}: Props) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortBy, sortAsc]);

  const paginated = enablePagination
    ? sortedData.slice((page - 1) * pageSize, page * pageSize)
    : sortedData;

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={col.sortable ? styles.sortable : ''}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    sortAsc ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </span>
              </th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-sm text-muted-text py-6">
                No data available.
              </td>
            </tr>
          ) : (
            paginated.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
                {renderActions && <td className="flex gap-3">{renderActions(row, i)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {enablePagination && (
        <AdminPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
