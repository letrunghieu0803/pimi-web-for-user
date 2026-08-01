import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const delta = 1;
    const middle: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      middle.push(i);
    }

    const pages: (number | 'ellipsis')[] = [1];
    if (middle[0] > 2) pages.push('ellipsis');
    pages.push(...middle);
    if (middle[middle.length - 1] < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const rangeStart =
    totalItems !== undefined && pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const rangeEnd =
    totalItems !== undefined && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : undefined;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      {rangeStart !== undefined && rangeEnd !== undefined && (
        <p className="text-xs font-medium text-slate-500">
          Hiển thị {rangeStart}–{rangeEnd} trong {totalItems}
        </p>
      )}
      <div className="flex items-center gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl w-fit ml-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pageNumbers.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-xs font-bold text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition-all ${
                p === currentPage
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
