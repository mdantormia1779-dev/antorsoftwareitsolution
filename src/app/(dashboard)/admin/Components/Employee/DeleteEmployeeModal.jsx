'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteEmployeeModal = ({ isOpen, onClose, employee, onDeleteConfirm }) => {
  if (!isOpen || !employee) return null;

  const employeeId = employee.id || employee._id;
  const displayName = employee.name || employee.fullName || 'this employee';

  const handleDelete = () => {
    if (onDeleteConfirm && employeeId) {
      onDeleteConfirm(employeeId);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon Box */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 stroke-2" />
        </div>

        {/* Text Details */}
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Delete {displayName}?
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          This will permanently remove the employee record, including attendance history. This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
          >
            Delete Employee
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteEmployeeModal;