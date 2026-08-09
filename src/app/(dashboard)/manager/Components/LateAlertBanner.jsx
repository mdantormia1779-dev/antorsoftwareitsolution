'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LateAlertBanner = ({ name = "Owen Marsh", location = "Westline Hub", status = "failed" }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100/80 text-amber-600 rounded-xl shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {name} arrived late
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {location} · today at — · face verification status:{" "}
            <span className="text-rose-500 font-medium">{status}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LateAlertBanner;