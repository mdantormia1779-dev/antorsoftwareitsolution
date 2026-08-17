'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteEmployeeModal = ({ isOpen, onClose, employee, onDeleteConfirm, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !employee) return null;

  const employeeId = employee.id || employee._id;
  const organizationId = employee.organizationId;
  const displayName = employee.fullName || employee.name || 'this employee';

  // উভয় প্রপ নেম সাপোর্ট করার জন্য হ্যান্ডলার সেট করা হলো (যাতে মিসম্যাচ হলেও সমস্যা না হয়)
  const handleDeleteAction = onDeleteConfirm || onConfirm;

  const handleDelete = async () => {
    if (!employeeId || !handleDeleteAction) return;

    setIsDeleting(true);
    setErrorMsg('');

    try {
      // প্যারেন্ট কম্পোনেন্টের handleDelete ফাংশন কল করা
      const result = await handleDeleteAction(employeeId, organizationId);

      // result যদি অবজেক্ট আকারে success/error রিটার্ন করে অথবা সাকসেস হয়
      if (!result || result.success !== false) {
        onClose();
      } else {
        setErrorMsg(result?.error || 'Failed to delete employee.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon Box */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 stroke-2" />
        </div>

        {/* Text Details */}
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Delete {displayName}?
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          This will permanently remove the employee record, including attendance history. This action cannot be undone.
        </p>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl text-left">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete Employee'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

DeleteEmployeeModal.displayName = 'DeleteEmployeeModal';

export default DeleteEmployeeModal;