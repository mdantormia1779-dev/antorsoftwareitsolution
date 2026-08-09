'use client';

import React from 'react';
import EmployeeTableRow from './EmployeeTableRow';
import { UserX, Plus } from 'lucide-react';

const EmployeeTable = ({ 
  employees = [], 
  onEdit, 
  onToggleStatus, 
  onDelete, 
  onViewDetails,
  onAddClick 
}) => {
  // 🟢 ইউজার ডাটা না থাকলে আকর্ষণীয় Empty UI দেখাবে
  if (!employees || employees.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          No Employees Found
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mb-4">
          There are no employees to display right now. Try adjusting your search/filters or add a new employee.
        </p>
        
        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Branch</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Face Status</th>
            <th className="py-3 px-4">Check-In</th>
            <th className="py-3 px-4">Hours</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp, index) => {
            const rowKey = emp.id || emp._id || index;
            return (
              <EmployeeTableRow
                key={rowKey}
                employee={emp}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;