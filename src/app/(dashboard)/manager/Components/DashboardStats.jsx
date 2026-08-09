'use client';

import React from 'react';
import { Users, Check, Clock, X, BarChart2, TrendingUp } from 'lucide-react';

const DashboardStats = ({ data }) => {
  // ডিফাক্ট বা কাস্টম ডাটা
  const stats = [
    {
      id: 1,
      title: 'Total Employees',
      value: data?.totalEmployees ?? '3',
      icon: Users,
      iconBg: 'bg-blue-600',
      glowColor: 'from-blue-100/60 to-transparent',
    },
    {
      id: 2,
      title: 'Present',
      value: data?.present ?? '1',
      icon: Check,
      iconBg: 'bg-emerald-600',
      glowColor: 'from-emerald-100/60 to-transparent',
    },
    {
      id: 3,
      title: 'Late',
      value: data?.late ?? '1',
      icon: Clock,
      iconBg: 'bg-amber-500',
      glowColor: 'from-amber-100/60 to-transparent',
    },
    {
      id: 4,
      title: 'Absent',
      value: data?.absent ?? '2',
      icon: X,
      iconBg: 'bg-rose-500',
      glowColor: 'from-rose-100/60 to-transparent',
    },
    {
      id: 5,
      title: 'Working Hours',
      value: data?.workingHours ?? '398h',
      icon: BarChart2,
      iconBg: 'bg-sky-500',
      glowColor: 'from-sky-100/60 to-transparent',
    },
    {
      id: 6,
      title: 'Overtime',
      value: data?.overtime ?? '21h',
      icon: TrendingUp,
      iconBg: 'bg-purple-600',
      glowColor: 'from-purple-100/60 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-36"
          >
            {/* Top Right Background Glow Effect */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-linear-to-bl ${stat.glowColor} blur-2xl pointer-events-none`}
            />

            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center text-white shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Value and Label */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
                {stat.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;