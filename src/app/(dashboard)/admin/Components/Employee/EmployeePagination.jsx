'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeePagination = ({ currentPage = 1, totalPages = 2, onPageChange }) => {
  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100/60 text-xs text-slate-400 font-medium">
      <span>
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmployeePagination;