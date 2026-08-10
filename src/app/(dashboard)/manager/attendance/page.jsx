'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(true);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).toUpperCase();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/attendance');
        const result = await res.json();

        if (result.success) {
          // সেফটি চেক: stats যদি না থাকে তবে ডিফল্ট ভ্যালু দিবে
          setStats(result.stats || { present: 0, late: 0, absent: 0 });

          const rawList = Array.isArray(result.data) ? result.data : [];

          const formatted = rawList.map((att, index) => {
            const fullName = att.user?.fullName || 'Unknown Employee';
            const nameParts = fullName.trim().split(' ');
            let initials = 'EM';
            if (nameParts.length >= 2) {
              initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length > 0) {
              initials = nameParts[0].substring(0, 2).toUpperCase();
            }

            const bgColors = ['bg-emerald-600', 'bg-blue-600', 'bg-rose-600', 'bg-violet-600', 'bg-amber-600'];

            const checkInTime = att.checkInTime 
              ? new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
              : '—';

            const checkOutTime = att.checkOutTime 
              ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
              : '—';

            let checkInColor = 'text-slate-800 font-bold';
            if (checkInTime === '—') {
              checkInColor = att.status === 'ABSENT' ? 'text-rose-500 font-bold' : 'text-slate-400';
            } else if (att.status === 'LATE') {
              checkInColor = 'text-amber-500 font-bold';
            }

            return {
              id: att.id,
              empCode: att.user?.empCode || `EMP-${2000 + index}`,
              name: fullName,
              initials: initials,
              avatarBg: bgColors[index % bgColors.length],
              branch: att.branchRef?.name || 'Main Branch',
              checkIn: checkInTime,
              checkInColor: checkInColor,
              checkOut: checkOutTime,
              hours: att.totalHours || '0h 00m',
              overtime: att.overtime || '0h 00m',
              faceStatus: att.faceStatus === 'VERIFIED' ? 'Verified' : 'Failed',
              isVerified: att.faceStatus === 'VERIFIED',
            };
          });

          setAttendanceData(formatted);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            TODAY · {todayFormatted}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
            Attendance
          </h1>
        </div>
      </div>

      {/* Top Stat Cards (Safeguarded with optional chaining and fallback) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Present */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-emerald-500">{stats?.present ?? 0}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Present</p>
        </div>

        {/* Late */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-amber-500">{stats?.late ?? 0}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Late</p>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-2xs">
          <p className="text-3xl font-bold text-rose-500">{stats?.absent ?? 0}</p>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium text-xs">
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendanceData.length > 0 ? (
                attendanceData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Employee Name & Avatar */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <Avatar className={`h-9 w-9 ${emp.avatarBg} text-white font-semibold shrink-0`}>
                          <AvatarFallback className={`${emp.avatarBg} text-white text-xs font-bold`}>
                            {emp.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {emp.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {emp.empCode}
                          </span>
                        </div>
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium text-xs">
                    No attendance records found for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AttendancePage;