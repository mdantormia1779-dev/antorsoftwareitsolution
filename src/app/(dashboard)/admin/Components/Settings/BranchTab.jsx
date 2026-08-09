'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const BranchTab = () => {
  const [formData, setFormData] = useState({
    dutyStart: '09:00 AM',
    dutyEnd: '06:00 PM',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Branch:', formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Duty start</label>
            <div className="relative">
              <input
                type="text"
                value={formData.dutyStart}
                onChange={(e) => setFormData({ ...formData, dutyStart: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Duty end</label>
            <div className="relative">
              <input
                type="text"
                value={formData.dutyEnd}
                onChange={(e) => setFormData({ ...formData, dutyEnd: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
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

export default BranchTab;