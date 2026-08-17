'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  BarChart2, 
  Users, 
  Building2, 
  TrendingUp, 
  Download, 
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

const ReportsPage = () => {
  const [loadingId, setLoadingId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const reports = [
    { id: 'daily-attendance', title: 'Daily Attendance Report', description: "Snapshot of today's check-ins, absences and late arrivals.", icon: Calendar, endpoint: 'attendance' },
    { id: 'monthly-attendance', title: 'Monthly Attendance Report', description: 'Aggregated attendance trends for the current month.', icon: BarChart2, endpoint: 'attendance' },
    { id: 'employee-report', title: 'Employee Report', description: 'Per-employee working hours, overtime and punctuality.', icon: Users, endpoint: 'headcount' },
    { id: 'branch-report', title: 'Branch Report', description: 'Branch-level performance and headcount comparisons.', icon: Building2, endpoint: 'leave' },
    { id: 'overtime-report', title: 'Overtime Report', description: 'Ranked overtime hours across all branches.', icon: TrendingUp, endpoint: 'attendance' },
  ];

  const handleExport = async (type, report) => {
    const exportKey = `${report.id}-${type}`;
    setLoadingId(exportKey);

    try {
      // ব্যাকএন্ডের সঠিক রাউট (যেমন: /reports/attendance বা /reports/headcount) এ কল করা হচ্ছে
      const res = await fetch(`${apiUrl}/reports/${report.endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders()
      });
      
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Generation failed');
      }

      // ডেটাকে ফাইলে কনভার্ট করে ডাউনলোড করার ব্যবস্থা
      const reportContent = JSON.stringify(result.data, null, 2);
      const blob = new Blob([reportContent], { type: type === 'PDF' ? 'text/plain;charset=utf-8' : 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const extension = type === 'PDF' ? 'txt' : 'csv';
      a.download = `${report.id}_report.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(error.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          GENERATE & EXPORT
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Reports
        </h1>
      </div>

      {/* Reports Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {reports.map((report) => {
          const IconComponent = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between space-y-6 shadow-2xs hover:border-slate-200/80 transition-all"
            >
              <div className="space-y-3.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug">{report.title}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{report.description}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  disabled={loadingId === `${report.id}-PDF`}
                  onClick={() => handleExport('PDF', report)}
                  className="flex-1 py-2 px-4 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {loadingId === `${report.id}-PDF` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                  )}
                  <span>{loadingId === `${report.id}-PDF` ? 'Generating...' : 'PDF'}</span>
                </button>

                <button
                  disabled={loadingId === `${report.id}-Excel`}
                  onClick={() => handleExport('Excel', report)}
                  className="flex-1 py-2 px-4 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {loadingId === `${report.id}-Excel` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                  )}
                  <span>{loadingId === `${report.id}-Excel` ? 'Generating...' : 'Excel'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;