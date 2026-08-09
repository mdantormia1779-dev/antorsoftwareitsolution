'use client';

import React from 'react';
import AnalyticsHeader from '../Components/Analytics/AnalyticsHeader';
import OvertimeRankingCard from '../Components/Analytics/OvertimeRankingCard';
import AttendanceSplitCard from '../Components/Attendence/AttendanceSplitCard';

const Analytics = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <AnalyticsHeader />

      {/* Analytics Cards Grid */}
      <div className="space-y-6">
        {/* Overtime Ranking */}
        <OvertimeRankingCard />

        {/* Attendance Split Donut Chart */}
        <AttendanceSplitCard present={75} late={12} absent={13} />
      </div>

    </div>
  );
};

export default Analytics;