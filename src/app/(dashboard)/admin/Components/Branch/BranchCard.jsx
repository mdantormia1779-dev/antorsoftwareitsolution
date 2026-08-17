'use client';

import React from 'react';
import { Building2, MapPin, Pencil, Trash2, Star } from 'lucide-react';

const BranchCard = ({ branch, onEdit, onDelete }) => {
  // ডাটাবেজের ফিল্ডের সাথে সঠিক ম্যাপিং
  const address = branch.address || 'N/A';
  
  // Prisma _count বা সরাসরি employees এরে থেকে সংখ্যা বের করার লজিক
  const employeesCount = branch._count?.employees 
    ?? (Array.isArray(branch.employees) ? branch.employees.length : 0);

  const score = branch.score ?? 100;
  const presentRate = branch.presentRate || '100%';

  // presentRate থেকে ৯০ বা তার বেশি হলে Green, কম হলে Yellow দেখাবে
  const numericRate = parseInt(presentRate) || 100;
  const isHigh = branch.presentStatus 
    ? branch.presentStatus === 'high' 
    : numericRate >= 90;

  // ম্যানেজার নাম বের করার লজিক (Prisma relation থেকে)
  const managerName = branch.manager?.fullName || branch.managerName || 'Unassigned';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
      {/* Card Header: Icon & Badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isHigh
              ? 'bg-emerald-100/70 text-emerald-700'
              : 'bg-amber-100/70 text-amber-700'
          }`}
        >
          {presentRate} present
        </span>
      </div>

      {/* Branch Details */}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800">
          {branch.name}
        </h3>
        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {address}
        </p>
        <p className="text-xs text-slate-500 pt-1">
          Manager: <span className="font-semibold text-slate-700">{managerName}</span>
        </p>
      </div>

      {/* Stats & Progress Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{employeesCount} employees</span>
          <span className="flex items-center gap-1 text-purple-600">
            <Star className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            {score}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button 
          type="button"
          onClick={() => onEdit && onEdit(branch)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        <button 
          type="button"
          onClick={() => onDelete && onDelete(branch)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BranchCard;