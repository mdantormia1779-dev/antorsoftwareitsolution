'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const WeeklyAttendanceChart = ({ organizationId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড এপিআই ইউআরএল সেটআপ
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        let url = `${apiUrl}/dashboard/weekly-attendance`;
        if (organizationId) {
          url += `?organizationId=${organizationId}`;
        }

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const result = await res.json();

        if (result.success) {
          setAttendanceData(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load weekly attendance chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [organizationId]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            THIS WEEK
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Weekly Attendance
          </h2>
        </div>
        {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Updating...</span>}
      </div>

      {/* Area Chart Container */}
      <div className="h-72 sm:h-80 w-full">
        {loading && attendanceData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">
            Loading chart data...
          </div>
        ) : (
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
                domain={[0, 'auto']}
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
        )}
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