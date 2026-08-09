'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const SecurityTab = () => {
  const [formData, setFormData] = useState({
    currentPassword: '••••••••',
    newPassword: '••••••••',
    twoFactor: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Security Settings:', formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 font-semibold">Current password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
          />
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 font-semibold">New password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 transition-all"
          />
        </div>

        {/* Two-Factor Authentication Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Two-factor authentication</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, twoFactor: !formData.twoFactor })
            }
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              formData.twoFactor ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.twoFactor ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
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

export default SecurityTab;