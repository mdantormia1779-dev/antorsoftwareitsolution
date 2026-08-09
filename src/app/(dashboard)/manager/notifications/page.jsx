'use client';

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const NotificationsPage = () => {
  // ছবির ডাটা অনুযায়ী নোটিফিকেশন লিস্ট
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Payroll cutoff moved to the 28th',
      description: "Finance has shifted this month's payroll cutoff two days earlier to accommodate the bank holiday.",
      branch: 'All branches',
      time: 'Today, 09:12',
      priority: 'High',
      priorityColor: 'bg-rose-50 text-rose-500 border-rose-100',
      isUnread: true,
      hasAttachment: false,
    },
    {
      id: 2,
      title: 'Westline Hub — fire drill at 3 PM',
      description: 'A scheduled fire drill will take place this afternoon. Please follow floor marshal instructions.',
      branch: 'Westline Hub',
      time: 'Today, 08:40',
      priority: 'Medium',
      priorityColor: 'bg-amber-50 text-amber-600 border-amber-100',
      isUnread: true,
      hasAttachment: true,
    },
    {
      id: 3,
      title: 'Quarterly attendance review published',
      description: 'Q2 attendance and overtime summaries are now available in Reports.',
      branch: 'All branches',
      time: '2 days ago',
      priority: 'Low',
      priorityColor: 'bg-blue-50 text-blue-600 border-blue-100',
      isUnread: false,
      hasAttachment: false,
    },
  ]);

  // আনরিড সংখ্যা গণনা
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // নোটিফিকেশনে ক্লিক করলে রিড করার হ্যান্ডলার
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          {unreadCount} UNREAD
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Notifications
        </h1>
      </div>

      {/* Notifications List Container */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-4 transition-all cursor-pointer shadow-2xs ${
              item.isUnread 
                ? 'border-blue-200/80 bg-blue-50/1-5' 
                : 'border-slate-100 hover:border-slate-200/80'
            }`}
          >
            {/* Left Content */}
            <div className="flex items-start gap-3.5">
              {/* Unread Blue Dot Indicator */}
              <div className="pt-1.5 shrink-0">
                {item.isUnread ? (
                  <span className="block w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                ) : (
                  <span className="block w-2.5 h-2.5 bg-transparent"></span>
                )}
              </div>

              <div className="space-y-1">
                {/* Title */}
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Attachment info if exists */}
                {item.hasAttachment && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pt-0.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Image attached</span>
                  </div>
                )}

                {/* Branch & Time Meta */}
                <p className="text-[11px] text-slate-400 font-medium pt-1">
                  {item.branch} · {item.time}
                </p>
              </div>
            </div>

            {/* Right Priority Badge */}
            <div className="shrink-0 pt-0.5">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${item.priorityColor}`}>
                {item.priority}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationsPage;