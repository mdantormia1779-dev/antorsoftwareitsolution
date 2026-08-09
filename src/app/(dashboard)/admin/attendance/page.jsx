'use client';

import React, { useState } from 'react';
import AttendanceHeader from '../Components/Attendence/AttendanceHeader';
import AttendanceStats from '../Components/Attendence/AttendanceStats';
import AttendanceTable from '../Components/Attendence/AttendanceTable';

const initialAttendanceRecords = [
  {
    id: '1',
    name: 'Noah Bergström',
    initials: 'NB',
    avatarColor: 'bg-purple-600',
    branch: 'Meridian HQ',
    checkIn: '09:41',
    checkOut: '18:20',
    hours: '8h 39m',
    overtime: '0h 20m',
    faceStatus: 'Verified',
    isLate: true,
  },
  {
    id: '2',
    name: 'Priya Nair',
    initials: 'PN',
    avatarColor: 'bg-emerald-600',
    branch: 'Westline Hub',
    checkIn: '08:15',
    checkOut: '17:32',
    hours: '9h 17m',
    overtime: '0h 00m',
    faceStatus: 'Verified',
    isLate: false,
  },
  {
    id: '3',
    name: 'Meiling Zhao',
    initials: 'MZ',
    avatarColor: 'bg-rose-500',
    branch: 'Meridian HQ',
    checkIn: '08:58',
    checkOut: '17:59',
    hours: '9h 01m',
    overtime: '0h 00m',
    faceStatus: 'Verified',
    isLate: false,
  },
  {
    id: '4',
    name: 'Owen Marsh',
    initials: 'OM',
    avatarColor: 'bg-red-500',
    branch: 'Westline Hub',
    checkIn: '—',
    checkOut: '—',
    hours: '0h 00m',
    overtime: '0h 00m',
    faceStatus: 'Failed',
    isLate: false,
  },
  {
    id: '5',
    name: 'Zara Hussain',
    initials: 'ZH',
    avatarColor: 'bg-indigo-600',
    branch: 'Harbor Point',
    checkIn: '09:03',
    checkOut: '18:11',
    hours: '9h 08m',
    overtime: '0h 11m',
    faceStatus: 'Verified',
    isLate: false,
  },
  {
    id: '6',
    name: 'Lucas Ferreira',
    initials: 'LF',
    avatarColor: 'bg-teal-600',
    branch: 'Riverside Office',
    checkIn: '09:12',
    checkOut: '18:30',
    hours: '9h 18m',
    overtime: '0h 30m',
    faceStatus: 'Verified',
    isLate: true,
  },
  {
    id: '7',
    name: 'Isla Fontaine',
    initials: 'IF',
    avatarColor: 'bg-teal-600',
    branch: 'Westline Hub',
    checkIn: '—',
    checkOut: '—',
    hours: '0h 00m',
    overtime: '0h 00m',
    faceStatus: 'Verified',
    isLate: false,
  },
];

const Attendance = () => {
  const [records] = useState(initialAttendanceRecords);

  // Stats calculation
  const presentCount = records.filter(
    (r) => r.checkIn !== '—' && !r.isLate
  ).length;
  const lateCount = records.filter((r) => r.isLate).length;
  const absentCount = records.filter((r) => r.checkIn === '—').length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <AttendanceHeader date="AUG 07, 2026" />

      {/* Summary Cards */}
      <AttendanceStats
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
      />

      {/* Attendance Table */}
      <AttendanceTable records={records} />
    </div>
  );
};

export default Attendance;