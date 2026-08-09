'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from './Components/Sidebar';

export default function ManagerLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Route অনুযায়ী Dynamic Title নির্ধারণ
  const getPageTitle = (path) => {
    switch (path) {
      case '/manager':
        return 'Dashboard';
      case '/manager/employees':
        return 'Employees';
      case '/manager/verification-queue':
        return 'Verification Queue';
      case '/manager/attendance':
        return 'Attendance';
      case '/manager/reports':
        return 'Reports';
      case '/manager/notifications':
        return 'Notifications';
      case '/manager/settings':
        return 'Settings';
      default:
        return 'Manager Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex">
      {/* Sidebar Component */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Dynamic Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {getPageTitle(pathname)}
            </h1>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <Sun className="w-5 h-5" />
            </button>

            {/* Notification Indicator */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Manager Profile Avatar & Name */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <Avatar className="h-9 w-9 bg-emerald-600 text-white font-semibold">
                <AvatarFallback className="bg-emerald-600 text-white text-xs">
                  PN
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  Priya Nair
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Branch Manager
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}