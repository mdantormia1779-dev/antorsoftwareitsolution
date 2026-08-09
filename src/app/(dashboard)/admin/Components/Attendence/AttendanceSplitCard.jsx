'use client';

import React from 'react';

const AttendanceSplitCard = ({ present = 70, late = 15, absent = 15 }) => {
  // SVG Donut Calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const presentOffset = circumference - (present / 100) * circumference;
  const lateOffset = circumference - (late / 100) * circumference;
  const absentOffset = circumference - (absent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs space-y-6">
      
      {/* Header Info */}
      <div>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
          TODAY
        </p>
        <h3 className="text-base font-bold text-slate-800">
          Attendance Split
        </h3>
      </div>

      {/* Donut Chart Visual */}
      <div className="flex flex-col items-center justify-center py-4 space-y-6">
        
        {/* SVG Custom Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Present (Blue) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-blue-600 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={presentOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Late (Amber) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-amber-500 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={lateOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${(present / 100) * 360}deg)`,
              }}
            />
            {/* Absent (Rose) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-rose-500 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={absentOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${((present + late) / 100) * 360}deg)`,
              }}
            />
          </svg>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Present</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Late</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Absent</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AttendanceSplitCard;