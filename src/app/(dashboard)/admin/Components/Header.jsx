'use client';

import React from 'react';
import { Sun, Bell } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100">
          <Sun className="w-4 h-4" />
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            AD
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-bold text-slate-800">Alex Donovan</p>
            <p className="text-[10px] text-slate-400 font-medium">Main Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;