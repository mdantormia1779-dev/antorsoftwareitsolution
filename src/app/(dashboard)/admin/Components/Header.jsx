'use client';

import React, { useState } from 'react';
import { Sun } from 'lucide-react';

const Header = ({ title }) => {
  // ডামি বা লোকাল স্টোরেজ থেকে এডমিন ডেটা স্টেট
  const [adminData, setAdminData] = useState({
    fullName: 'Admin User',
    role: 'SUPER_ADMIN'
  });

  // নাম থেকে ইনিশিয়াল বের করার হেল্পার ফাংশন
  const getInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 relative">
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100">
          <Sun className="w-4 h-4" />
        </button>

        {/* Admin Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {getInitials(adminData.fullName)}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-bold text-slate-800 uppercase">{adminData.fullName}</p>
            <p className="text-[10px] text-slate-400 font-medium">{adminData.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;