'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  FileText,
  LineChart,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Organization', icon: Building2, href: '/admin/organization' },
  { name: 'Branches', icon: Building2, href: '/admin/branches' },
  { name: 'Employees', icon: Users, href: '/admin/employees' },
  { name: 'Attendance', icon: CalendarCheck, href: '/admin/attendance' },
  { name: 'Reports', icon: FileText, href: '/admin/reports' },
  { name: 'Analytics', icon: LineChart, href: '/admin/analytics' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // লোকাল স্টোরেজ থেকে এডমিন ডাটা রিমুভ করা
    localStorage.removeItem('admin');
    
    // লগইন পেজে রিডায়রেক্ট করা (আপনার প্রজেক্টের পাথ অনুযায়ী /admin/login অথবা /login দিন)
    router.push('/admin/login');
  };

  return (
    <aside
      className={`bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100/60">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <CalendarCheck className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-slate-800 text-sm tracking-tight whitespace-nowrap">
                Smart Attendance
              </span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ChevronLeft
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
          {!isCollapsed && <span>Collapse</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;