'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  User,
  X,
  Mail,
  Phone,
  Calendar,
  Scan,
  MapPin,
  Pencil,
  Power,
  Trash2,
  Building2,
  Briefcase,
  Building,
  ShieldCheck,
} from 'lucide-react';

const EmployeeDetailsModal = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [employee]);

  if (!isOpen || !employee) return null;

  // ডামি বার চার্ট ডাটা (Mon - Sun)
  const attendanceData = [
    { day: 'Mon', height: 'h-24' },
    { day: 'Tue', height: 'h-28' },
    { day: 'Wed', height: 'h-22' },
    { day: 'Thu', height: 'h-30' },
    { day: 'Fri', height: 'h-26' },
    { day: 'Sat', height: 'h-12' },
    { day: 'Sun', height: 'h-6' },
  ];

  // তারিখ ফরম্যাট করার হেল্পার (e.g. 08 Aug 2026)
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // নাম থেকে Initial বের করা
  const getInitials = (name) => {
    if (!name) return 'E';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = employee.fullName || employee.name || 'Unknown Employee';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <User className="w-4 h-4 text-blue-600" />
            <span>Employee Details</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Profile Header Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              
              {/* Avatar / Image */}
              <div
                className={`relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center text-white font-bold text-xl ${
                  employee.avatarColor || 'bg-blue-600'
                }`}
              >
                {employee.avatar && !imageError ? (
                  <Image
                    src={employee.avatar}
                    alt={displayName}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>{employee.initials || getInitials(displayName)}</span>
                )}
              </div>

              {/* Employee Basic Info */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {displayName}
                  </h3>
                  {/* Emp Code Badge */}
                  {employee.empCode && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {employee.empCode}
                    </span>
                  )}
                </div>

                {/* Designation & Dept */}
                <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  {employee.designation && (
                    <span className="flex items-center gap-1 text-slate-700">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      {employee.designation}
                    </span>
                  )}
                  {employee.department && (
                    <span>· {employee.department}</span>
                  )}
                </p>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 font-medium">
                  {employee.branch && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {employee.branch}
                    </span>
                  )}
                  {employee.companyName && (
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {employee.companyName}
                    </span>
                  )}
                  {employee.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {employee.email}
                    </span>
                  )}
                  {employee.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {employee.phone}
                    </span>
                  )}
                  {employee.joiningDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Joined {formatDate(employee.joiningDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status & Role Badges */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-start">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  employee.status === 'Active'
                    ? 'bg-emerald-100/70 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {employee.status || 'Active'}
              </span>

              {employee.role && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 tracking-wider">
                  {employee.role}
                </span>
              )}
            </div>
          </div>

          {/* 4 Cards Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-3 text-center">
              <span className="block text-base font-bold text-slate-800">
                {employee.checkIn || '—'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Check-in</span>
            </div>

            <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-3 text-center">
              <span className="block text-base font-bold text-slate-800">
                {employee.checkOut || '—'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Check-out</span>
            </div>

            <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-3 text-center">
              <span className="block text-base font-bold text-slate-800">
                {employee.hours || '0h 00m'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Hours</span>
            </div>

            <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-3 text-center">
              <span className="block text-base font-bold text-slate-800">
                {employee.overtime || '0h 00m'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Overtime</span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Scan className="w-4 h-4 text-slate-400" />
                <span>Face verification</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  employee.faceStatus === 'Verified'
                    ? 'bg-emerald-100/70 text-emerald-700'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {employee.faceStatus || 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Location verification</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                {employee.locationVerification || 'Not checked in'}
              </span>
            </div>
          </div>

          {/* Monthly Attendance Chart */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Monthly Attendance
            </h4>
            
            <div className="bg-slate-50/40 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-end justify-between h-32 px-4 gap-3">
                {attendanceData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        className={`w-3.5 bg-blue-600 rounded-t-full transition-all hover:bg-indigo-600 ${item.height}`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onToggleStatus(employee.id);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{employee.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(employee);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;