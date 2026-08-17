'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MonthlyWorkingHoursChart = ({ organizationId }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // কম্পোনেন্টের ভেতরে কনস্ট্যান্ট হিসেবে apiUrl ডিফাইন করুন
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        let url = `${apiUrl}/dashboard/monthly-hours`;
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
          setMonthlyData(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load monthly hours chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [organizationId]); // এখানে ডিপেন্ডেন্সি শুধু organizationId রাখুন

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            OVERTIME
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Monthly Working Hours & Overtime
          </h2>
        </div>
        {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Syncing...</span>}
      </div>

      <div className="h-72 sm:h-80 w-full">
        {loading && monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">
            Loading chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} ticks={[0, 1500, 3000, 4500, 6000]} domain={[0, 6000]} />
              <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }} />
              <Bar dataKey="workingHours" name="Working Hours" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={90} />
              <Bar dataKey="overtime" name="Overtime" fill="#C084FC" radius={[6, 6, 0, 0]} maxBarSize={90} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyWorkingHoursChart;