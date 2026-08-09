'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Scan, 
  CalendarCheck, 
  FileText, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Calendar
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/manager', icon: LayoutDashboard },
    { name: 'Employees', href: '/manager/employees', icon: Users },
    { name: 'Verification Queue', href: '/manager/verification-queue', icon: Scan },
    { name: 'Attendance', href: '/manager/attendance', icon: CalendarCheck },
    { name: 'Reports', href: '/manager/reports', icon: FileText },
    { name: 'Notifications', href: '/manager/notifications', icon: Bell },
    { name: 'Settings', href: '/manager/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand / Logo */}
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-800 text-base tracking-tight whitespace-nowrap">
              Smart Attendance
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-slate-800 text-white text-xs opacity-0 -translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Log Out Button */}
        <button
          onClick={() => {
            // handle logout logic here
            console.log("Logged out");
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-500 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;