'use client';

import React, { useState } from 'react';
import { Pencil, Power, Trash2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const EmployeeTableRow = ({
  employee = {},
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  // Safe Guard Check
  if (!employee || (!employee.id && !employee._id)) {
    return null;
  }

  const {
    id,
    _id,
    name,
    fullName,
    empCode,
    avatar,
    avatarColor,
    initials,
    branchRef, // Prisma relation থেকে আসা ব্রাঞ্চ অবজেক্ট
    branch,    // স্ট্রিং বা অন্য ফরম্যাট থাকলে
    status,
    faceStatus,
    checkIn,
    isLate,
    hours,
  } = employee;

  const employeeId = id || _id;
  const displayName = name || fullName || 'Unknown';
  const displayInitials = initials || displayName.charAt(0).toUpperCase();

  // ব্রাঞ্চের নাম সঠিকভাবে বের করার লজিক
  const displayBranch = branchRef?.name || branch?.name || (typeof branch === 'string' ? branch : 'N/A');

  // স্ট্যাটাস চ্যাকিং
  const isActive = status === 'ACTIVE' || status === 'Active' || status === true;

  return (
    <tr
      onClick={() => onViewDetails && onViewDetails(employee)}
      className="border-b border-slate-100/70 hover:bg-slate-50/70 transition-all text-xs sm:text-sm cursor-pointer group"
    >
      {/* 👤 Employee Info & Image */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          
          {/* 🖼️ Avatar Box (Image with Fallback Initials) */}
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-2xs border border-slate-100 relative bg-slate-100 flex items-center justify-center">
            {avatar && !imageError ? (
              <Image
                src={avatar}
                alt={displayName || 'User Avatar'}
                fill
                sizes="36px"
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div
                className={`w-full h-full ${
                  avatarColor || 'bg-indigo-600'
                } text-white font-bold text-xs flex items-center justify-center`}
              >
                {displayInitials}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {displayName}
            </h4>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">{empCode || 'N/A'}</p>
          </div>
        </div>
      </td>

      {/* Branch Name */}
      <td className="py-3.5 px-4 font-semibold text-slate-600">{displayBranch}</td>

      {/* Active Status Badge */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            isActive
              ? 'bg-emerald-100/70 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {status || (isActive ? 'Active' : 'Inactive')}
        </span>
      </td>

      {/* Face Status Badge */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            faceStatus === 'Verified'
              ? 'bg-emerald-100/70 text-emerald-700'
              : 'bg-rose-100/80 text-rose-600'
          }`}
        >
          {faceStatus || 'Unverified'}
        </span>
      </td>

      {/* Check-In Time */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <span
            className={`font-semibold ${
              isLate ? 'text-amber-600 font-bold' : 'text-slate-700'
            }`}
          >
            {checkIn || '--:--'}
          </span>
          {isLate && (
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">
              Late
            </span>
          )}
        </div>
      </td>

      {/* Hours Worked */}
      <td className="py-3.5 px-4 font-semibold text-slate-600">{hours || '0h 0m'}</td>

      {/* Actions */}
      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 text-slate-400">
          <button
            type="button"
            onClick={() => onEdit && onEdit(employee)}
            className="hover:text-slate-700 transition-colors p-1 cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(employeeId)}
            className="hover:text-emerald-600 transition-colors p-1 cursor-pointer"
            title="Toggle Status"
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete && onDelete(employee)}
            className="hover:text-rose-500 transition-colors p-1 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(employee)}
            className="hover:text-indigo-600 transition-colors p-1 cursor-pointer"
            title="View Details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeTableRow;