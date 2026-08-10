'use client';

import React, { useState, useEffect } from 'react';
import AttendanceHeader from '../Components/Attendence/AttendanceHeader';
import AttendanceStats from '../Components/Attendence/AttendanceStats';
import AttendanceTable from '../Components/Attendence/AttendanceTable';

const Attendance = ({ organizationId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // আজকের তারিখ ফরম্যাট করা (যেমন: AUG 09, 2026)
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const url = organizationId
          ? `/api/attendance?organizationId=${organizationId}`
          : '/api/attendance';

        const res = await fetch(url);
        const result = await res.json();

        if (result.success) {
          setRecords(result.data);
        }
      } catch (error) {
        console.error('Failed to load attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [organizationId]);

  // Stats calculation
  const presentCount = records.filter(
    (r) => r.checkIn !== '—' && !r.isLate
  ).length;
  const lateCount = records.filter((r) => r.isLate).length;
  const absentCount = records.filter((r) => r.checkIn === '—').length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <AttendanceHeader date={todayDateStr} />

      {/* Summary Cards */}
      <AttendanceStats
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
      />

      {/* Attendance Table */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400 font-medium bg-white rounded-2xl border border-slate-100">
          Loading attendance records...
        </div>
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
};

export default Attendance;