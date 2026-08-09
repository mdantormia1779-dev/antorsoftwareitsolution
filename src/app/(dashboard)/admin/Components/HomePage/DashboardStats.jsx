'use client';

import React from 'react';
import {
  Building2,
  Users,
  Check,
  X,
  Clock,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

const statsData = [
  {
    id: 1,
    value: '4',
    label: 'Total Branches',
    badge: '↗ +1 this qtr',
    badgeColor: 'text-emerald-500 bg-emerald-50/60',
    icon: Building2,
    iconBg: 'bg-blue-600',
    glowColor: 'from-white via-white to-blue-100/50',
  },
  {
    id: 2,
    value: '9',
    label: 'Total Employees',
    badge: '↗ +12',
    badgeColor: 'text-emerald-500 bg-emerald-50/60',
    icon: Users,
    iconBg: 'bg-indigo-600',
    glowColor: 'from-white via-white to-purple-100/50',
  },
  {
    id: 3,
    value: '6',
    label: 'Present Today',
    badge: '↗ +3.1%',
    badgeColor: 'text-emerald-500 bg-emerald-50/60',
    icon: Check,
    iconBg: 'bg-emerald-600',
    glowColor: 'from-white via-white to-emerald-100/50',
  },
  {
    id: 4,
    value: '2',
    label: 'Absent Today',
    badge: '↗ -1.4%',
    badgeColor: 'text-emerald-500 bg-emerald-50/60',
    icon: X,
    iconBg: 'bg-rose-500',
    glowColor: 'from-white via-white to-rose-100/50',
  },
  {
    id: 5,
    value: '3',
    label: 'Late Employees',
    badge: '↘ +2',
    badgeColor: 'text-rose-500 bg-rose-50/60',
    icon: Clock,
    iconBg: 'bg-amber-500',
    glowColor: 'from-white via-white to-amber-100/50',
  },
  {
    id: 6,
    value: '1,624h',
    label: 'Working Hours',
    badge: '↗ +4.2%',
    badgeColor: 'text-emerald-500 bg-emerald-50/60',
    icon: BarChart2,
    iconBg: 'bg-sky-500',
    glowColor: 'from-white via-white to-sky-100/50',
  },
  {
    id: 7,
    value: '96h',
    label: 'Total Overtime',
    badge: '↘ +18h',
    badgeColor: 'text-rose-500 bg-rose-50/60',
    icon: TrendingUp,
    iconBg: 'bg-purple-600',
    glowColor: 'from-white via-white to-purple-100/50',
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-7xl mx-auto p-2">
      {statsData.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className={`relative overflow-hidden bg-linear-to-br ${item.glowColor} rounded-2xl border border-slate-100 p-6 flex flex-col justify-between h-44 shadow-2xs hover:shadow-xs transition-all`}
          >
            {/* Top Row: Icon and Badge */}
            <div className="flex items-start justify-between z-10">
              <div
                className={`w-10 h-10 ${item.iconBg} text-white rounded-xl flex items-center justify-center shadow-xs shrink-0`}
              >
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-tight ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            </div>

            {/* Bottom Row: Number and Label */}
            <div className="z-10 mt-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {item.value}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;