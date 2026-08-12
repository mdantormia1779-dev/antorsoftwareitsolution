'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Camera, History, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState({
    fullName: 'Employee',
    role: 'Frontend Developer',
    orgName: 'Antor Software & It Solution', // অর্গানাইজেশন নাম ডিফল্ট
    initials: 'EM'
  });

  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        const userObj = parsedUser.user || parsedUser;
        
        const fullName = userObj.fullName || userObj.name || 'Employee';
        const role = userObj.designation || userObj.role || 'Frontend Developer';
        
        // আপনার দেওয়া JSON ডেটা থেকে অর্গানাইজেশনের নাম পিক করা
        const orgName = userObj.organization?.name || userObj.companyName || 'Meridian HR';

        const nameParts = fullName.trim().split(' ');
        let initials = 'U';
        if (nameParts.length >= 2) {
          initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          initials = nameParts[0].substring(0, 2).toUpperCase();
        }

        setUserData({
          fullName,
          role,
          orgName,
          initials
        });
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('isCheckedIn');
      localStorage.removeItem('checkInTime');
      localStorage.removeItem('isPendingApproval');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Home', href: '/employee', icon: Home },
    { name: 'Attendance', href: '/employee/attendence', icon: Camera },
    { name: 'History', href: '/employee/history', icon: History },
    { name: 'Profile', href: '/employee/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-6 justify-between shrink-0 h-screen sticky top-0">
      <div className="space-y-8">
        {/* Dynamic Organization / Company Name */}
        <Link href="/employee" className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {userData.orgName ? userData.orgName.charAt(0) : 'M'}
          </div>
          <span className="font-bold text-slate-800 text-sm truncate" title={userData.orgName}>
            {userData.orgName}
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Real User Info & Logout */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-9 w-9 bg-blue-600 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
              {userData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left truncate">
            <p className="text-sm font-semibold text-slate-800 truncate" title={userData.fullName}>
              {userData.fullName}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize" title={userData.role}>
              {userData.role}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 p-1"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;