'use client';

import React from 'react';

const LiveTimeline = ({ events }) => {
  const timelineEvents = events || [
    {
      id: 1,
      time: '08:15',
      text: 'Priya Nair checked in',
      status: 'success', // green dot
    },
    {
      id: 2,
      time: '—',
      text: 'Owen Marsh verification pending',
      status: 'danger', // red dot
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          Today
        </span>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Live Timeline
        </h3>
      </div>

      {/* Timeline Tree */}
      <div className="relative pl-3 space-y-6 before:absolute before:left-4.25 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-100">
        {timelineEvents.map((item, index) => (
          <div key={item.id} className="relative flex items-start gap-4 z-10">
            {/* Status Dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ring-4 ring-white ${
                item.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />

            {/* Content */}
            <div className="text-xs sm:text-sm">
              <span className="text-slate-400 font-medium mr-2">
                {item.time}
              </span>
              <span className="text-slate-700 font-medium">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTimeline;