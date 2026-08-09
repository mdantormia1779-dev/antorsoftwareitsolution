'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// চার্টের ডাইনামিক ডাটা
const attendanceData = [
  { day: 'Mon', present: 180 },
  { day: 'Tue', present: 185 },
  { day: 'Wed', present: 175 },
  { day: 'Thu', present: 190 },
  { day: 'Fri', present: 170 },
  { day: 'Sat', present: 70 },
  { day: 'Sun', present: 25 },
];

const WeeklyAttendanceChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          THIS WEEK
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
          Weekly Attendance
        </h2>
      </div>

      {/* Area Chart Container */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={attendanceData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Color Gradient Definition */}
            <defs>
              <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              ticks={[0, 50, 100, 150, 200]}
              domain={[0, 200]}
            />

            {/* Hover Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#E2E8F0',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            />

            {/* Smooth Curve Area */}
            <Area
              type="monotone"
              dataKey="present"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPresent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Legend Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-2">
        <span className="w-3 h-3 bg-blue-600 rounded-full inline-block"></span>
        <span className="text-xs font-semibold text-blue-600">Present</span>
      </div>

    </div>
  );
};

export default WeeklyAttendanceChart;