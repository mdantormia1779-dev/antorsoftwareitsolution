'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড থেকে নোটিফিকেশন ফেচ করা
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item) => {
          let priorityColor = 'bg-blue-50 text-blue-600 border-blue-100';
          const priority = item.priority || 'Medium';

          if (priority.toLowerCase() === 'high') {
            priorityColor = 'bg-rose-50 text-rose-500 border-rose-100';
          } else if (priority.toLowerCase() === 'medium') {
            priorityColor = 'bg-amber-50 text-amber-600 border-amber-100';
          }

          // সময়ের হিসাব বা ফরম্যাট
          const timeString = item.createdAt 
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : 'Recently';

          // branch যদি অবজেক্ট হয়, তবে তার name প্রপার্টি বের করে নেব (অন্যথায় ডিফল্ট টেক্সট)
          let branchName = 'All branches';
          if (typeof item.branch === 'object' && item.branch !== null) {
            branchName = item.branch.name || 'Branch';
          } else if (typeof item.branch === 'string') {
            branchName = item.branch;
          }

          return {
            id: item.id,
            title: item.title,
            description: item.description || item.body, // বডি বা ডেসক্রিপশন দুটোই হ্যান্ডেল করার জন্য
            branch: branchName,
            time: timeString,
            priority: priority,
            priorityColor: priorityColor,
            isUnread: item.isRead === false || !item.isRead, 
            hasAttachment: item.hasAttachment || false,
          };
        });

        setNotifications(formatted);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // নোটিফিকেশনে ক্লিক করলে ব্যাকএন্ডে আপডেট করা এবং লোকাল স্টেট পরিবর্তন করা
  const markAsRead = async (id) => {
    try {
      // প্রথমে লোকাল স্টেটে আপডেট করে ইউআই ফাস্ট রাখা
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
      );

      // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
    } catch (error) {
      console.error('Error updating notification read status:', error);
    }
  };

  // আনরিড সংখ্যা গণনা
  const unreadCount = notifications.filter((n) => n.isUnread).length;

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
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-medium text-xs sm:text-sm">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-4 transition-all cursor-pointer shadow-2xs ${
                item.isUnread 
                  ? 'border-blue-200/80 bg-blue-50/10' 
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
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-medium text-xs sm:text-sm">
            No notifications found.
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;