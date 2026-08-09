import React from "react";
import { MapPin, Wifi, WifiOff } from "lucide-react";

const LocationCheckStep = ({ onInsideRadius, onOutsideRadius }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center transition-all duration-500 space-y-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100/70 flex items-center justify-center mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-200/60 flex items-center justify-center">
            <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 fill-blue-600/10" />
          </div>
        </div>

        <div className="space-y-1.5 px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Checking your location...
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Confirming you're within Meridian HQ's geofence
          </p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3 pt-4 px-2">
        <button
          onClick={onInsideRadius}
          className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-xs sm:text-sm"
        >
          <Wifi className="w-4 h-4" />
          <span>Simulate: Inside Radius</span>
        </button>

        <button
          onClick={onOutsideRadius}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs sm:text-sm"
        >
          <WifiOff className="w-4 h-4 text-slate-400" />
          <span>Simulate: Outside Radius</span>
        </button>
      </div>
    </div>
  );
};

export default LocationCheckStep;