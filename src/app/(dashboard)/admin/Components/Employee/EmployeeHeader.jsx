'use client';

import React from 'react';
import { Plus } from 'lucide-react';

const EmployeeHeader = ({ totalShown = 7, onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          {totalShown} OF {totalShown} SHOWN
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
          Employees
        </h2>
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer w-fit"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add Employee</span>
      </button>
    </div>
  );
};

export default EmployeeHeader;