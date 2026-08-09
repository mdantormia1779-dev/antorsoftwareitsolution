'use client';

import React, { useState, useRef } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const fileInputRef = useRef(null);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    fullName: 'Alex Donovan',
    email: 'alex@meridian.io',
    phone: '+1 212 555 0100',
    role: 'Main Admin',
  });

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফটো চেঞ্জ বাটনে ক্লিক হ্যান্ডলার
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Data:', formData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          CONFIGURE YOUR WORKSPACE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Settings
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('Profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'Profile'
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab('Security')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'Security'
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'Profile' ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-2xs max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              {/* Custom Initial Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-xs shrink-0">
                AD
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />

              <button
                type="button"
                onClick={handlePhotoClick}
                className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                Change photo
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Security Tab Content Placeholder */
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-2xs max-w-2xl text-slate-500 text-xs sm:text-sm">
          Security settings and password management options will appear here.
        </div>
      )}

    </div>
  );
};

export default SettingsPage;