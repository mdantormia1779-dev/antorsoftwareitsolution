'use client';

import React from 'react';
import DashboardStats from './Components/DashboardStats';
import LateAlertBanner from './Components/LateAlertBanner';
import VerificationQueue from './Components/VerificationQueue';
import LiveTimeline from './Components/LiveTimeline';

const ManagerHomePage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ১. স্ট্যাটাস কার্ডসমূহ */}
      <DashboardStats />

      {/* ২. লেট নোটিফিকেশন ব্যানার */}
      <LateAlertBanner />

      {/* ৩. ভেরিফিকেশন কিউ সেকশন */}
      <VerificationQueue />

      {/* ৪. লাইভ টাইমলাইন সেকশন */}
      <LiveTimeline />
    </div>
  );
};

export default ManagerHomePage;