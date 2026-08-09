'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon */}
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">
            Delete announcement?
          </h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            This announcement will be removed for all recipients.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;