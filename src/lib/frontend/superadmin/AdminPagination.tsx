'use client';

import styles from '@/styles/table.module.css';

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

const pageSizes = [10, 30, 50];

function getPageRange(current: number, total: number): (number | string)[] {
  const range: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) range.push(i);
  } else {
    range.push(1);
    if (current > 4) range.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) range.push(i);
    if (current < total - 3) range.push('...');
    range.push(total);
  }

  return range;
}

export default function AdminPagination({
  totalPages,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  const range = getPageRange(currentPage, totalPages);

  return (
    <div className={styles.paginationWrapper}>
      {/* Page Size Selector */}
      <div className={styles.pageSizeGroup}>
        <span className="text-sm text-muted-text">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className={styles.pageNav}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Prev
        </button>

        {range.map((item, idx) =>
          item === '...' ? (
            <span key={idx} className={styles.pageDots}>
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item as number)}
              className={`${styles.pageNumber} ${
                item === currentPage ? styles.activePage : ''
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
           disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
