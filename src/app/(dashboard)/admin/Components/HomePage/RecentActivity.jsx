'use client';

import React from 'react';
import {
  Check,
  LogOut,
  ScanFace,
  Building2,
  AlertTriangle,
} from 'lucide-react';

const activities = [
  {
    id: 1,
    boldText: 'Ava Whitfield',
    normalText: 'checked in',
    meta: 'Meridian HQ · 2 min ago',
    icon: Check,
    iconBg: 'bg-emerald-100/70 text-emerald-600',
  },
  {
    id: 2,
    boldText: 'Priya Nair',
    normalText: 'checked out',
    meta: 'Westline Hub · 6 min ago',
    icon: LogOut,
    iconBg: 'bg-blue-100/70 text-blue-600',
  },
  {
    id: 3,
    boldText: 'Zara Hussain',
    normalText: 'was face-verified',
    meta: 'Harbor Point · 14 min ago',
    icon: ScanFace,
    iconBg: 'bg-purple-100/70 text-purple-600',
  },
  {
    id: 4,
    boldText: 'Riverside Office',
    normalText: '— Branch settings updated',
    meta: '41 min ago',
    icon: Building2,
    iconBg: 'bg-slate-100 text-slate-600',
  },
  {
    id: 5,
    boldText: 'Lucas Ferreira',
    normalText: 'checked in',
    meta: 'Riverside Office · 48 min ago',
    icon: Check,
    iconBg: 'bg-emerald-100/70 text-emerald-600',
  },
  {
    id: 6,
    boldText: 'Owen Marsh',
    normalText: 'failed verification',
    meta: 'Westline Hub · 1 hr ago',
    icon: AlertTriangle,
    iconBg: 'bg-rose-100/70 text-rose-600',
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          LIVE FEED
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
          Recent Activity
        </h2>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3.5 group">
              
              {/* Rounded Square Icon Box */}
              <div
                className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Text & Meta Subtext */}
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm text-slate-600">
                  <span className="font-bold text-slate-800">
                    {item.boldText}
                  </span>{' '}
                  <span className="font-medium text-slate-600">
                    {item.normalText}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {item.meta}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RecentActivity;