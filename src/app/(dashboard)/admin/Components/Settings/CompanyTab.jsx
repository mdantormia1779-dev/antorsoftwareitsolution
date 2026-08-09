'use client';

import React, { useState } from 'react';

const CompanyTab = () => {
  const [formData, setFormData] = useState({
    companyName: 'Meridian Group Inc.',
    industry: 'Technology',
    registeredAddress: '500 Market St, New York, NY',
    timeZone: 'GMT-5 New York',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Company:', formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Company name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Registered address</label>
            <input
              type="text"
              value={formData.registeredAddress}
              onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Time zone</label>
            <input
              type="text"
              value={formData.timeZone}
              onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
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

export default CompanyTab;