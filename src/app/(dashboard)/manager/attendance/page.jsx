'use client';

import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AttendancePage = () => {
  // স্ক্রিনশটের অ্যাটেনডেন্স ডাটা
  const attendanceData = [
    {
      id: 'EMP-2011',
      name: 'Priya Nair',
      initials: 'PN',
      avatarBg: 'bg-emerald-600',
      branch: 'Westline Hub',
      checkIn: '08:15',
      checkInColor: 'text-slate-800 font-bold',
      checkOut: '17:32',
      hours: '9h 17m',
      overtime: '0h 00m',
      faceStatus: 'Verified',
      isVerified: true
    },
    {
      id: 'EMP-2054',
      name: 'Owen Marsh',
      initials: 'OM',
      avatarBg: 'bg-rose-600',
      branch: 'Westline Hub',
      checkIn: '—',
      checkInColor: 'text-amber-500 font-bold',
      checkOut: '—',
      hours: '0h 00m',
      overtime: '0h 00m',
      faceStatus: 'Failed',
      isVerified: false
    },
    {
      id: 'EMP-2098',
      name: 'Isla Fontaine',
      initials: 'IF',
      avatarBg: 'bg-emerald-600',
      branch: 'Westline Hub',
      checkIn: '—',
      checkInColor: 'text-slate-400',
      checkOut: '—',
      hours: '0h 00m',
      overtime: '0h 00m',
      faceStatus: 'Verified',
      isVerified: true
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            TODAY · AUG 07, 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
            Attendance
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export PDF</span>
          </button>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs">
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Present */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-emerald-500">1</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Present</p>
        </div>

        {/* Late */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-amber-500">1</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Late</p>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-rose-500">2</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Absent</p>
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3">Check-In</th>
                <th className="py-3 px-3">Check-Out</th>
                <th className="py-3 px-3">Hours</th>
                <th className="py-3 px-3">Overtime</th>
                <th className="py-3 px-3">Face</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs sm:text-sm">
              {attendanceData.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Employee Name & Avatar */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-9 w-9 ${emp.avatarBg} text-white font-semibold shrink-0`}>
                        <AvatarFallback className={`${emp.avatarBg} text-white text-xs font-bold`}>
                          {emp.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-slate-800">
                        {emp.name}
                      </span>
                    </div>
                  </td>

                  {/* Branch */}
                  <td className="py-4 px-3 text-slate-500 font-medium">
                    {emp.branch}
                  </td>

                  {/* Check-In */}
                  <td className="py-4 px-3">
                    <span className={emp.checkInColor}>
                      {emp.checkIn}
                    </span>
                  </td>

                  {/* Check-Out */}
                  <td className="py-4 px-3 text-slate-600 font-medium">
                    {emp.checkOut}
                  </td>

                  {/* Hours */}
                  <td className="py-4 px-3 text-slate-600 font-medium">
                    {emp.hours}
                  </td>

                  {/* Overtime */}
                  <td className="py-4 px-3 text-slate-600 font-medium">
                    {emp.overtime}
                  </td>

                  {/* Face Status */}
                  <td className="py-4 px-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      emp.isVerified 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-500'
                    }`}>
                      {emp.faceStatus}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AttendancePage;