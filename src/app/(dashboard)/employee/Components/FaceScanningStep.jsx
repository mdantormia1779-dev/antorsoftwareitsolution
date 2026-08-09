import React from "react";
import { ScanFace } from "lucide-react";

const FaceScanningStep = ({ progress, onFail }) => {
  return (
    <div className="flex flex-col items-center justify-center transition-all duration-300">
      {/* Animated Circle Ring */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-0.75 bg-linear-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/10 animate-pulse">
          <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center overflow-hidden relative">
            <ScanFace className="w-20 h-20 sm:w-24 sm:h-24 text-sky-400 stroke-[1.5] animate-bounce" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-sky-400/10 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-sm px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Scanning face...
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Hold steady and look at the camera ({progress}%)
        </p>
      </div>

      {/* Simulation Fail Button */}
      <button
        onClick={onFail}
        className="mt-8 text-xs text-rose-500 underline opacity-70 hover:opacity-100 cursor-pointer"
      >
        (Simulate: Face Scan Fail)
      </button>
    </div>
  );
};

export default FaceScanningStep;