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

// চার্টের ডাইনামিক ডাটা (W1 - W4)
const monthlyData = [
  { week: 'W1', workingHours: 4100, overtime: 200 },
  { week: 'W2', workingHours: 4250, overtime: 250 },
  { week: 'W3', workingHours: 4000, overtime: 180 },
  { week: 'W4', workingHours: 4350, overtime: 280 },
];

const MonthlyWorkingHoursChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          OVERTIME
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
          Monthly Working Hours & Overtime
        </h2>
      </div>

      {/* Bar Chart Container */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={8}
          >
            {/* Background Grid Lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            {/* X Axis */}
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            {/* Y Axis (0 - 6000) */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              ticks={[0, 1500, 3000, 4500, 6000]}
              domain={[0, 6000]}
            />

            {/* Hover Tooltip */}
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#E2E8F0',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            />

            {/* Working Hours Bar (Blue) */}
            <Bar
              dataKey="workingHours"
              name="Working Hours"
              fill="#2563EB"
              radius={[6, 6, 0, 0]}
              maxBarSize={90}
            />

            {/* Overtime Bar (Purple) */}
            <Bar
              dataKey="overtime"
              name="Overtime"
              fill="#C084FC"
              radius={[6, 6, 0, 0]}
              maxBarSize={90}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default MonthlyWorkingHoursChart;