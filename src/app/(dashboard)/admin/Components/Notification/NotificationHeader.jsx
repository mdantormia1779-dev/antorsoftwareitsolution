'use client';

import React from 'react';
import { Plus } from 'lucide-react';

const NotificationHeader = ({ unreadCount = 2, onOpenCreateModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
          {unreadCount} UNREAD
        </p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Notifications
        </h1>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>New Announcement</span>
      </button>
    </div>
  );
};

export default NotificationHeader;