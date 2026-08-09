'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, History, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const pathname = usePathname();

  // নেভিগেশন আইটেম এবং তাদের রাউট লিংক
  const navItems = [
    { name: 'Home', href: '/employee', icon: Home },
    { name: 'Attendance', href: '/employee/attendence', icon: Camera },
    { name: 'History', href: '/employee/history', icon: History },
    { name: 'Profile', href: '/employee/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-6 justify-between shrink-0 h-screen sticky top-0">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/employee" className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="font-bold text-slate-800 text-lg">Meridian HR</span>
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

      {/* User Info */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 bg-blue-600">
            <AvatarFallback className="bg-blue-600 text-white font-semibold">AW</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">Ava Wright</p>
            <p className="text-xs text-slate-400">Software Developer</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;