'use client';

import React from 'react';
import {
  CalendarDays,
  BarChart3,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';
import ReportHeader from '../Components/Repors/ReportHeader';
import ReportCard from '../Components/Repors/ReportCard';

const reportData = [
  {
    id: '1',
    title: 'Daily Attendance Report',
    description: "Snapshot of today's check-ins, absences and late arrivals.",
    icon: CalendarDays,
  },
  {
    id: '2',
    title: 'Monthly Attendance Report',
    description: 'Aggregated attendance trends for the current month.',
    icon: BarChart3,
  },
  {
    id: '3',
    title: 'Employee Report',
    description: 'Per-employee working hours, overtime and punctuality.',
    icon: Users,
  },
  {
    id: '4',
    title: 'Branch Report',
    description: 'Branch-level performance and headcount comparisons.',
    icon: Building2,
  },
  {
    id: '5',
    title: 'Overtime Report',
    description: 'Ranked overtime hours across all branches.',
    icon: TrendingUp,
  },
];

const Reports = () => {
  const handleExportPDF = (title) => {
    console.log(`Exporting PDF for: ${title}`);
  };

  const handleExportExcel = (title) => {
    console.log(`Exporting Excel for: ${title}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Section */}
      <ReportHeader />

      {/* Reports Grid (2 columns on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportData.map((report) => (
          <ReportCard
            key={report.id}
            icon={report.icon}
            title={report.title}
            description={report.description}
            onExportPDF={() => handleExportPDF(report.title)}
            onExportExcel={() => handleExportExcel(report.title)}
          />
        ))}
      </div>

    </div>
  );
};

export default Reports;