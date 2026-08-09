'use client';

import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

const AttendanceHeader = ({ date = 'AUG 07, 2026' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
          TODAY · {date}
        </p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Attendance
        </h1>
      </div>

      {/* Export Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => console.log('Export PDF')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={() => console.log('Export Excel')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Excel</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceHeader;