'use client';

import React from 'react';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'company', label: 'Company' },
  { id: 'branch', label: 'Branch' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'security', label: 'Security' },
];

const SettingsHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
          CONFIGURE YOUR WORKSPACE
        </p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsHeader;