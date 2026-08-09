'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, History, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();

  // রাউট লিস্ট (Sidebar ও BottomNav দুইটার জন্যই একই লিস্ট)
  const navItems = [
    { name: 'Home', href: '/employee', icon: Home },
    { name: 'Attendance', href: '/employee/attendence', icon: Camera },
    { name: 'History', href: '/employee/history', icon: History },
    { name: 'Profile', href: '/employee/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-sans">
      
      {/* 1. DESKTOP SIDEBAR (বড় স্ক্রিনে দেখাবে) */}
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

      {/* 2. MAIN CONTENT AREA (পেজের সব কনটেন্ট এখানে রেন্ডার হবে) */}
      <main className="flex-1 pb-20 lg:pb-8">
        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION (শুধু মোবাইল ও ট্যাবলেটে দেখাবে) */}
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