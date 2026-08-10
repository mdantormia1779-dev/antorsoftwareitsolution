'use client';

import React, { useState } from 'react';
// আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী কম্পোনেন্টের ফাইল পাথসমূহ চেক করে নিন
import DashboardStats from './Components/HomePage/DashboardStats';
import WeeklyAttendanceChart from './Components/HomePage/WeeklyAttendanceChart';
import RecentActivity from './Components/HomePage/RecentActivity';
import MonthlyWorkingHoursChart from './Components/HomePage/MonthlyWorkingHoursChart';
import BranchPerformanceChart from './Components/Branch/BranchPerformanceChart';

const AdminPage = () => {
  // যদি আপনার অর্গানাইজেশন আইডি গ্লোবাল স্টেট, লোকাল স্টোরেজ বা প্রপস থেকে আসে, 
  // তবে এখানে সেই অনুযায়ী স্টেট বা ভ্যারিয়েবল সেট করে নিবেন।
  const [selectedOrgId, setSelectedOrgId] = useState('');

  return (
    <div className="sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ১. স্ট্যাটাস কার্ড গ্রিড */}
      <section>
        <DashboardStats organizationId={selectedOrgId} />
      </section>

      {/* ২. মিডল সেকশন: উইকলি এটেন্ডেন্স চার্ট এবং লাইভ অ্যাক্টিভিটি ফিড */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyAttendanceChart organizationId={selectedOrgId} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity organizationId={selectedOrgId} />
        </div>
      </section>

      {/* ৩. বটম সেকশন: মান্থলি ওয়ার্কিং আওয়ার্স এবং ব্রাঞ্চ পারফরম্যান্স */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyWorkingHoursChart organizationId={selectedOrgId} />
        <BranchPerformanceChart organizationId={selectedOrgId} />
      </section>
    </div>
  );
};

export default AdminPage;