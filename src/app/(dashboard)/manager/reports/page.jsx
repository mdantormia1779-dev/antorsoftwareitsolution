'use client';

import React from 'react';
import { 
  Calendar, 
  BarChart2, 
  Users, 
  Building2, 
  TrendingUp, 
  Download, 
  FileSpreadsheet 
} from 'lucide-react';

const ReportsPage = () => {
  // ছবির ডাটা অনুযায়ী রিপোর্ট লিস্ট
  const reports = [
    {
      id: 'daily-attendance',
      title: 'Daily Attendance Report',
      description: "Snapshot of today's check-ins, absences and late arrivals.",
      icon: Calendar,
    },
    {
      id: 'monthly-attendance',
      title: 'Monthly Attendance Report',
      description: 'Aggregated attendance trends for the current month.',
      icon: BarChart2,
    },
    {
      id: 'employee-report',
      title: 'Employee Report',
      description: 'Per-employee working hours, overtime and punctuality.',
      icon: Users,
    },
    {
      id: 'branch-report',
      title: 'Branch Report',
      description: 'Branch-level performance and headcount comparisons.',
      icon: Building2,
    },
    {
      id: 'overtime-report',
      title: 'Overtime Report',
      description: 'Ranked overtime hours across all branches.',
      icon: TrendingUp,
    },
  ];

  // এক্সপোর্ট বাটন অ্যাকশন
  const handleExport = (type, reportTitle) => {
    console.log(`Exporting ${reportTitle} as ${type}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
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
              {/* Card Header & Content */}
              <div className="space-y-3.5">
                {/* Purple Icon Box */}
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* PDF & Excel Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExport('PDF', report.title)}
                  className="flex-1 py-2 px-4 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => handleExport('Excel', report.title)}
                  className="flex-1 py-2 px-4 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                  <span>Excel</span>
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