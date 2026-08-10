'use client';

import React, { useState, useEffect } from 'react';

const OvertimeRankingCard = ({ organizationId }) => {
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOvertimeRanking = async () => {
      try {
        setLoading(true);
        const url = organizationId
          ? `/api/dashboard/overtime-ranking?organizationId=${organizationId}`
          : '/api/dashboard/overtime-ranking';

        const res = await fetch(url);
        const result = await res.json();

        if (result.success) {
          setOvertimeData(result.data);
        }
      } catch (error) {
        console.error('Failed to load overtime ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOvertimeRanking();
  }, [organizationId]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs space-y-6 w-full">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5 block">
            TOP PERFORMERS
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Overtime Ranking
          </h3>
        </div>
        {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Syncing...</span>}
      </div>

      {/* Chart Section */}
      <div className="space-y-4 pt-2">
        {loading && overtimeData.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            Loading ranking data...
          </div>
        ) : (
          overtimeData.map((item, index) => {
            // maxHours এর সাপেক্ষে উইথ পার্সেন্টেজ হিসাব (সর্বোচ্চ ১০০% পর্যন্ত লিমিট করা)
            const maxVal = item.maxHours || 16;
            const widthPercentage = Math.min((item.hours / maxVal) * 100, 100);

            return (
              <div key={index} className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                {/* Employee Name */}
                <span className="w-20 text-right shrink-0 truncate" title={item.name}>
                  {item.name}
                </span>

                {/* Progress Bar Container */}
                <div className="flex-1 bg-slate-50 rounded-full h-3.5 relative overflow-hidden flex items-center">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  />
                  <span className="absolute right-2 text-[10px] font-bold text-slate-600">
                    {item.hours}h
                  </span>
                </div>
              </div>
            );
          })
        )}

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