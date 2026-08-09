'use client';

import React, { useState } from 'react';

const ProfileTab = () => {
  const [formData, setFormData] = useState({
    fullName: 'Alex Donovan',
    email: 'alex@meridian.io',
    phone: '+1 212 555 0100',
    role: 'Main Admin',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Profile:', formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs max-w-xl space-y-6">
      {/* Profile Avatar Section */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-purple-500/20">
          AD
        </div>
        <button
          type="button"
          className="px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Change photo
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Full name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-500 font-semibold">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

export default ProfileTab;