'use client'
import React from 'react';
import { Mail, Phone, UserCheck, LogOut } from 'lucide-react';

const ProfilePage = () => {
  // ইউজার ডাটা
  const user = {
    name: 'Ava Whitfield',
    role: 'Product Designer',
    department: 'Meridian HQ',
    initials: 'AW',
    email: 'ava.whitfield@meridian.io',
    phone: '+1 212 555 0142',
    empId: 'EMP-1042',
  };

  const handleLogout = () => {
    // লগআউট লজিক এখানে যুক্ত করুন
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Header / Avatar Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4">
          {/* Avatar Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md">
            {user.initials}
          </div>

          {/* Name & Role */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {user.role} · {user.department}
            </p>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
          {/* Email */}
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium break-all">
              {user.email}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {user.phone}
            </span>
          </div>

          {/* Employee ID */}
          <div className="flex items-center gap-3 text-slate-600">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {user.empId}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-rose-200 hover:bg-rose-50/50 text-rose-500 font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm sm:text-base cursor-pointer"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Log out</span>
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;