'use client';

import React from 'react';

const AttendanceTable = ({ records }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-4 px-6">EMPLOYEE</th>
              <th className="py-4 px-6">BRANCH</th>
              <th className="py-4 px-6">CHECK-IN</th>
              <th className="py-4 px-6">CHECK-OUT</th>
              <th className="py-4 px-6">HOURS</th>
              <th className="py-4 px-6">OVERTIME</th>
              <th className="py-4 px-6">FACE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
            {records.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* Employee Name & Initials */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${item.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {item.initials}
                    </div>
                    <span className="font-bold text-slate-800">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Branch */}
                <td className="py-3.5 px-6 text-slate-500">{item.branch}</td>

                {/* Check-In */}
                <td className="py-3.5 px-6">
                  <span
                    className={`font-semibold ${
                      item.isLate ? 'text-amber-500' : 'text-slate-800'
                    }`}
                  >
                    {item.checkIn}
                  </span>
                </td>

                {/* Check-Out */}
                <td className="py-3.5 px-6 text-slate-600">
                  {item.checkOut}
                </td>

                {/* Hours */}
                <td className="py-3.5 px-6 text-slate-600">{item.hours}</td>

                {/* Overtime */}
                <td className="py-3.5 px-6 text-slate-600">{item.overtime}</td>

                {/* Face Verification Status */}
                <td className="py-3.5 px-6">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      item.faceStatus === 'Verified'
                        ? 'bg-emerald-100/70 text-emerald-700'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {item.faceStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;