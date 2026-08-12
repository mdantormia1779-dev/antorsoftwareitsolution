'use client';

import React, { useState, useEffect } from 'react';
import { Users, Check, Clock, X, BarChart2, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  // ডাটা রাখার জন্য স্টেট
  const [statsData, setStatsData] = useState({
    totalEmployees: '0',
    present: '0',
    late: '0',
    absent: '0',
    workingHours: '0h',
    overtime: '0h',
  });
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন (আপনার ব্যাকএন্ড API এন্ডপয়েন্ট অনুযায়ী)
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // উদাহরণস্বরূপ ব্রাউজারের localStorage বা কুকি থেকে লগইন করা ইউজারের আইডি নেওয়া হচ্ছে
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = loggedInUser.id || ''; // আপনার প্রজেক্টের স্ট্রাকচার অনুযায়ী এটি দেবেন

      const res = await fetch(`/api/dashboard/stats?userId=${userId}`);
      const result = await res.json();
      
      if (result.success) {
        setStatsData({
          totalEmployees: result.data.totalEmployees || '0',
          present: result.data.present || '0',
          late: result.data.late || '0',
          absent: result.data.absent || '0',
          workingHours: result.data.workingHours || '0h',
          overtime: result.data.overtime || '0h',
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // প্রয়োজনে এখানে একটি ইন্টারভ্যাল বা কাস্টম ইভেন্ট লিসেনার যোগ করতে পারেন
    const interval = setInterval(fetchStats, 60000); // প্রতি ১ মিনিট পর পর অটো রিফ্রেশ
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { id: 1, title: 'Total Employees', value: statsData.totalEmployees, icon: Users, iconBg: 'bg-blue-600', glowColor: 'from-blue-100/60 to-transparent' },
    { id: 2, title: 'Present', value: statsData.present, icon: Check, iconBg: 'bg-emerald-600', glowColor: 'from-emerald-100/60 to-transparent' },
    { id: 3, title: 'Late', value: statsData.late, icon: Clock, iconBg: 'bg-amber-500', glowColor: 'from-amber-100/60 to-transparent' },
    { id: 4, title: 'Absent', value: statsData.absent, icon: X, iconBg: 'bg-rose-500', glowColor: 'from-rose-100/60 to-transparent' },
    { id: 5, title: 'Working Hours', value: statsData.workingHours, icon: BarChart2, iconBg: 'bg-sky-500', glowColor: 'from-sky-100/60 to-transparent' },
    { id: 6, title: 'Overtime', value: statsData.overtime, icon: TrendingUp, iconBg: 'bg-purple-600', glowColor: 'from-purple-100/60 to-transparent' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-36"
          >
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-linear-to-bl ${stat.glowColor} blur-2xl pointer-events-none`} />
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center text-white shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {loading ? '...' : stat.value}
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