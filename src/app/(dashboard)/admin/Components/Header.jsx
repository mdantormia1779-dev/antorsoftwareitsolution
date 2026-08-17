'use client';

import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

const Header = ({ title }) => {
  const [adminData, setAdminData] = useState({
    fullName: 'Admin User',
    role: 'SUPER_ADMIN'
  });

  useEffect(() => {
    // লোকালস্টোরেজ থেকে ইউজারের রিয়েল ডাটা লোড করার ফাংশন
    const fetchAdminData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setAdminData({
            fullName: parsedUser.fullName || parsedUser.name || 'Admin User',
            role: parsedUser.role || 'SUPER_ADMIN'
          });
        } catch (err) {
          console.error('Failed to parse user data from localStorage', err);
        }
      }
    };

    // প্রথমবার কম্পোনেন্ট লোড হলে ডাটা আনবে
    fetchAdminData();

    // Settings পেজে আপডেট করার পর হেডার রিয়েল-টাইম আপডেট করার জন্য লিসেনার
    window.addEventListener('adminUpdated', fetchAdminData);

    return () => {
      window.removeEventListener('adminUpdated', fetchAdminData);
    };
  }, []);

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