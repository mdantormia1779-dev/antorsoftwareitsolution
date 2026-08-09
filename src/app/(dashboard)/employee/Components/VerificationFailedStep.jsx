import React from "react";
import { X } from "lucide-react";

const VerificationFailedStep = ({ onReset, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 transition-all duration-300">
      {/* Red Cross Icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-100/70 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-200/50 flex items-center justify-center">
          <X className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500 stroke-[2.5]" />
        </div>
      </div>

      {/* Error Message Text */}
      <div className="space-y-1.5 max-w-sm px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Face verification failed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
          We couldn't confirm your identity. Improve lighting and try again.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 pt-2 w-full max-w-xs px-4">
        <button
          onClick={onReset}
          className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-sm"
        >
          Try Again
        </button>

        <button
          onClick={onCancel}
          className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer pt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerificationFailedStep;