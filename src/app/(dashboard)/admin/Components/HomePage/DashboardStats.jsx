'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Check,
  X,
  Clock,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

const DashboardStats = ({ organizationId }) => {
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateEmployees: 0,
    workingHours: '1,624h',
    totalOvertime: '96h',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const url = organizationId 
          ? `/api/dashboard/stats?organizationId=${organizationId}` 
          : '/api/dashboard/stats';
          
        const res = await fetch(url);
        const result = await res.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [organizationId]);

  const statsData = [
    {
      id: 1,
      value: stats.totalBranches,
      label: 'Total Branches',
      badge: 'Active',
      badgeColor: 'text-emerald-500 bg-emerald-50/60',
      icon: Building2,
      iconBg: 'bg-blue-600',
      glowColor: 'from-white via-white to-blue-100/50',
    },
    {
      id: 2,
      value: stats.totalEmployees,
      label: 'Total Employees',
      badge: 'Registered',
      badgeColor: 'text-emerald-500 bg-emerald-50/60',
      icon: Users,
      iconBg: 'bg-indigo-600',
      glowColor: 'from-white via-white to-purple-100/50',
    },
    {
      id: 3,
      value: stats.presentToday,
      label: 'Present Today',
      badge: 'On Time',
      badgeColor: 'text-emerald-500 bg-emerald-50/60',
      icon: Check,
      iconBg: 'bg-emerald-600',
      glowColor: 'from-white via-white to-emerald-100/50',
    },
    {
      id: 4,
      value: stats.absentToday,
      label: 'Absent Today',
      badge: 'Not Logged',
      badgeColor: 'text-rose-500 bg-rose-50/60',
      icon: X,
      iconBg: 'bg-rose-500',
      glowColor: 'from-white via-white to-rose-100/50',
    },
    {
      id: 5,
      value: stats.lateEmployees,
      label: 'Late Employees',
      badge: 'Delayed',
      badgeColor: 'text-amber-500 bg-amber-50/60',
      icon: Clock,
      iconBg: 'bg-amber-500',
      glowColor: 'from-white via-white to-amber-100/50',
    },
    {
      id: 6,
      value: stats.workingHours,
      label: 'Working Hours',
      badge: '↗ +4.2%',
      badgeColor: 'text-emerald-500 bg-emerald-50/60',
      icon: BarChart2,
      iconBg: 'bg-sky-500',
      glowColor: 'from-white via-white to-sky-100/50',
    },
    {
      id: 7,
      value: stats.totalOvertime,
      label: 'Total Overtime',
      badge: '↗ +18h',
      badgeColor: 'text-purple-500 bg-purple-50/60',
      icon: TrendingUp,
      iconBg: 'bg-purple-600',
      glowColor: 'from-white via-white to-purple-100/50',
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 text-center text-slate-400 text-sm font-medium">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-7xl mx-auto p-2">
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