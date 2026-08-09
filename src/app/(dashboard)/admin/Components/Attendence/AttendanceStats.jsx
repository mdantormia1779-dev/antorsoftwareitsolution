'use client';

import React from 'react';

const AttendanceStats = ({ presentCount = 5, lateCount = 3, absentCount = 2 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Present Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
        <span className="block text-2xl font-bold text-emerald-500 mb-1">
          {presentCount}
        </span>
        <span className="text-xs font-medium text-slate-400">Present</span>
      </div>

      {/* Late Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
        <span className="block text-2xl font-bold text-amber-500 mb-1">
          {lateCount}
        </span>
        <span className="text-xs font-medium text-slate-400">Late</span>
      </div>

      {/* Absent Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
        <span className="block text-2xl font-bold text-rose-500 mb-1">
          {absentCount}
        </span>
        <span className="text-xs font-medium text-slate-400">Absent</span>
      </div>
    </div>
  );
};

export default AttendanceStats;