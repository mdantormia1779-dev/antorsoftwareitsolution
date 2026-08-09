"use client";

import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from './Components/Sidebar';
import CheckInCard from './Components/CheckInCard';
import StatCard from './Components/StatCard';
import WeeklyChart from './Components/WeeklyChart';
import RecentActivity from './Components/RecentActivity';
import BottomNav from './Components/BottomNav';

const EmployeePage = () => {
  const [workingTime, setWorkingTime] = useState("0h 00m");
  const [overtime, setOvertime] = useState("0h 00m");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateStats = () => {
      const isCheckedIn = localStorage.getItem("isCheckedIn") === "true";
      const savedTime = localStorage.getItem("checkInTime");

      if (isCheckedIn && savedTime) {
        const checkInMs = new Date(savedTime).getTime();
        const nowMs = new Date().getTime();
        const diffMs = Math.max(0, nowMs - checkInMs);

        // মোট কাজের মিনিট হিসাব
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Working Hours Today ডায়নামিক আপডেট
        setWorkingTime(`${hours}h ${String(minutes).padStart(2, '0')}m`);

        // ৮ ঘণ্টার (৪৮০ মিনিট) বেশি কাজ করলে তা ওভারটাইম হিসেবে যোগ হবে
        const standardWorkMinutes = 8 * 60; // ৮ ঘণ্টা
        if (totalMinutes > standardWorkMinutes) {
          const otMins = totalMinutes - standardWorkMinutes;
          const otHours = Math.floor(otMins / 60);
          const otRemainingMins = otMins % 60;
          setOvertime(`${otHours}h ${String(otRemainingMins).padStart(2, '0')}m`);
        } else {
          setOvertime("0h 00m");
        }
      } else {
        setWorkingTime("0h 00m");
        setOvertime("0h 00m");
      }
    };

    updateStats();
    // প্রতি ১০ সেকেন্ড পর পর হিসাব আপডেট করবে
    const interval = setInterval(updateStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const weeklyData = [
    { day: 'Mon', percent: '65%' },
    { day: 'Tue', percent: '80%' },
    { day: 'Wed', percent: '65%' },
    { day: 'Thu', percent: '95%' },
    { day: 'Fri', percent: '50%' },
    { day: 'Sat', percent: '30%' },
    { day: 'Sun', percent: '15%' },
  ];

  const recentActivities = [
    { title: 'Checked Out', time: 'Yesterday, 06:15 PM', status: 'Completed' },
    { title: 'Checked In', time: 'Yesterday, 09:02 AM', status: 'On Time' },
    { title: 'Checked Out', time: '12 Aug, 05:45 PM', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col lg:flex-row font-sans">

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 lg:mb-8">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Good morning,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Ava</h1>
          </div>
          <div className="lg:hidden">
            <Avatar className="h-10 w-10 bg-blue-600 text-white font-semibold">
              <AvatarFallback className="bg-blue-600 text-white">AW</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Section */}
          <div className="lg:col-span-2 space-y-6">
            <CheckInCard />

            {/* Dynamic StatCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard 
                title="Working Hours Today" 
                value={mounted ? workingTime : "0h 00m"} 
                icon={Clock} 
                iconBgColor="bg-blue-50" 
                iconColor="text-blue-600" 
              />
              <StatCard 
                title="Overtime (This Week)" 
                value={mounted ? overtime : "0h 00m"} 
                icon={TrendingUp} 
                iconBgColor="bg-purple-50" 
                iconColor="text-purple-600" 
              />
            </div>

            <WeeklyChart data={weeklyData} />
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <RecentActivity activities={recentActivities} />
          </div>

        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav />

    </div>
  );
};

export default EmployeePage;