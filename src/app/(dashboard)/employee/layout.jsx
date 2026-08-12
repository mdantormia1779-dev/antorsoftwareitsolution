'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, History, User } from 'lucide-react';
import Sidebar from './Components/Sidebar';

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();

  // মোবাইল বটম নেভিগেশনের জন্য রাউট লিস্ট
  const navItems = [
    { name: 'Home', href: '/employee', icon: Home },
    { name: 'Attendance', href: '/employee/attendence', icon: Camera },
    { name: 'History', href: '/employee/history', icon: History },
    { name: 'Profile', href: '/employee/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 pb-20 lg:pb-8">
        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex justify-around items-center z-50 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? 'text-blue-600 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}