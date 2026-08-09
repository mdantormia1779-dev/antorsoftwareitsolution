'use client';

import React, { useState } from 'react';

const AttendanceTab = () => {
  const [settings, setSettings] = useState({
    faceVerification: true,
    gpsGeofencing: true,
    autoFlagLate: true,
    gracePeriod: '10',
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Attendance Settings:', settings);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        
        {/* Toggle 1: Face Verification */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
          <span className="text-slate-700 font-semibold">
            Require face verification on check-in
          </span>
          <button
            type="button"
            onClick={() => toggleSetting('faceVerification')}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              settings.faceVerification ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.faceVerification ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: GPS Geofencing */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
          <span className="text-slate-700 font-semibold">
            Require GPS geofencing on check-in
          </span>
          <button
            type="button"
            onClick={() => toggleSetting('gpsGeofencing')}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              settings.gpsGeofencing ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.gpsGeofencing ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Auto-flag Late */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
          <span className="text-slate-700 font-semibold">
            Auto-flag late arrivals after grace period
          </span>
          <button
            type="button"
            onClick={() => toggleSetting('autoFlagLate')}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              settings.autoFlagLate ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.autoFlagLate ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Grace Period Input */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-slate-500 font-semibold">
            Grace period (minutes)
          </label>
          <input
            type="number"
            value={settings.gracePeriod}
            onChange={(e) =>
              setSettings({ ...settings, gracePeriod: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default AttendanceTab;