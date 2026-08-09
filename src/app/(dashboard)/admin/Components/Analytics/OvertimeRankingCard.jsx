'use client';

import React from 'react';

const overtimeData = [
  { name: 'Lucas F.', hours: 14.5, maxHours: 16 },
  { name: 'Ava W.', hours: 12.8, maxHours: 16 },
  { name: 'Zara H.', hours: 9.5, maxHours: 16 },
  { name: 'Noah B.', hours: 7.2, maxHours: 16 },
  { name: 'Meiling Z.', hours: 5.6, maxHours: 16 },
];

const OvertimeRankingCard = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs space-y-6">
      
      {/* Header Info */}
      <div>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
          TOP PERFORMERS
        </p>
        <h3 className="text-base font-bold text-slate-800">
          Overtime Ranking
        </h3>
      </div>

      {/* Chart Section */}
      <div className="space-y-4 pt-2">
        {overtimeData.map((item, index) => {
          const widthPercentage = (item.hours / item.maxHours) * 100;

          return (
            <div key={index} className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              {/* Employee Name */}
              <span className="w-20 text-right shrink-0">{item.name}</span>

              {/* Progress Bar Container */}
              <div className="flex-1 bg-slate-50 rounded-full h-3.5 relative overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* X-Axis Numbers Scale */}
        <div className="flex justify-between pl-24 pr-1 text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100/60">
          <span>0</span>
          <span>4</span>
          <span>8</span>
          <span>12</span>
          <span>16</span>
        </div>
      </div>

    </div>
  );
};

export default OvertimeRankingCard;