import React from 'react';
import { Home, Camera, History, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50">
      <button className="flex flex-col items-center gap-1 text-blue-600">
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
        <Camera className="w-5 h-5" />
        <span className="text-[10px] font-medium">Attendance</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
        <History className="w-5 h-5" />
        <span className="text-[10px] font-medium">History</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;