'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteBranchModal = ({ isOpen, onClose, branch, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !branch) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(branch.id);
      onClose();
    } catch (error) {
      console.error('Error deleting branch:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      {/* Modal Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-500 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Delete {branch.name}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            This will permanently remove the branch and unassign its employees.
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center disabled:opacity-60"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Branch'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteBranchModal;