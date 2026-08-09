'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ব্রাঞ্চের পারফর্ম্যান্স ডাটা
const branchData = [
  { name: 'Meridian', performance: 92 },
  { name: 'Westline', performance: 85 },
  { name: 'Riverside', performance: 78 },
  { name: 'Harbor', performance: 90 },
];

// কাস্টম টুলটিপ (ছবির মতো স্টাইল)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-xl text-center">
        <p className="text-xs font-bold text-slate-800">{data.name}</p>
        <p className="text-xs font-semibold text-purple-600 mt-0.5">
          performance : {data.performance}
        </p>
      </div>
    );
  }
  return null;
};

const BranchPerformanceChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          RANKING
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
          Branch Performance
        </h2>
      </div>

      {/* Horizontal Bar Chart Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={branchData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            barGap={12}
          >
            {/* Background Vertical Grid Lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#F1F5F9"
            />

            {/* X Axis (0 - 100) */}
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            {/* Y Axis (Branch Names) */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              width={80}
            />

            {/* Hover Tooltip with Gray Highlight Cursor */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(226, 232, 240, 0.6)' }}
            />

            {/* Purple Performance Bar */}
            <Bar
              dataKey="performance"
              fill="#8B5CF6"
              radius={[0, 8, 8, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default BranchPerformanceChart;