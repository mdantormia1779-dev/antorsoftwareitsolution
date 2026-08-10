'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Bell, X } from 'lucide-react';

const Header = ({ title }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // পড়া হয়ে যাওয়া নোটিফিকেশনগুলোর আইডি স্টোর করার স্টেট
  const [readNotificationIds, setReadNotificationIds] = useState([]);

  // ডাটাবেজ থেকে আনা এডমিন ডাটা রাখার স্টেট
  const [adminData, setAdminData] = useState({
    fullName: 'Admin',
    email: '',
    role: 'ADMIN'
  });

  // লোকাল স্টোরেজ থেকে অলরেডি পড়া নোটিফিকেশন আইডিগুলো লোড করা
  useEffect(() => {
    try {
      const savedRead = localStorage.getItem('read_notifications');
      if (savedRead) {
        setReadNotificationIds(JSON.parse(savedRead));
      }
    } catch (e) {
      console.error('Failed to load read notifications', e);
    }
  }, []);

  // ডাটাবেজ বা লোকাল স্টোরেজ থেকে এডমিন ডাটা লোড করার ফাংশন
  const loadAdminData = async () => {
    try {
      const storedAdmin = localStorage.getItem('admin') || localStorage.getItem('user');
      if (!storedAdmin) return;

      const parsed = JSON.parse(storedAdmin);
      const email = parsed.email;

      if (!email) return;

      const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`);
      const result = await res.json();

      if (result.success && result.data) {
        setAdminData({
          fullName: result.data.fullName || result.data.name || 'Admin',
          email: result.data.email || '',
          role: result.data.role || 'ADMIN'
        });
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
  };

  // নোটিফিকেশন ফেচ করা
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      const result = await res.json();
      
      if (result.success) {
        const fetchedList = result.data;
        setNotifications(fetchedList);
      }
    } catch (error) {
      console.error('Failed to fetch header notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    fetchNotifications();

    const handleAdminUpdate = () => {
      loadAdminData();
    };

    // নতুন নোটিফিকেশন তৈরি হলে রিয়েল-টাইমে আপডেট করার ইভেন্ট লিসেনার
    const handleNotificationRefresh = () => {
      fetchNotifications();
    };

    window.addEventListener('adminUpdated', handleAdminUpdate);
    window.addEventListener('notificationCreated', handleNotificationRefresh);

    return () => {
      window.removeEventListener('adminUpdated', handleAdminUpdate);
      window.removeEventListener('notificationCreated', handleNotificationRefresh);
    };
  }, []);

  // যখন নোটিফিকেশন প্যানেল ওপেন হবে
  const handleOpenNotification = () => {
    setIsNotificationOpen(true);
    fetchNotifications();

    // নোটিফিকেশন ড্রয়ার ওপেন করলে সবগুলো নতুন নোটিফিকেশনকে 'Read' হিসেবে মার্ক করে দেওয়া
    if (notifications.length > 0) {
      const allIds = notifications.map((item) => item.id);
      const updatedReadIds = Array.from(new Set([...readNotificationIds, ...allIds]));
      
      setReadNotificationIds(updatedReadIds);
      try {
        localStorage.setItem('read_notifications', JSON.stringify(updatedReadIds));
      } catch (e) {
        console.error('Failed to save read notifications', e);
      }
    }
  };

  // যে নোটিফিকেশনগুলো এখনও লোকাল স্টোরেজে রিড হিসেবে সেভ করা হয়নি, কেবল সেগুলোকে 'Unread' ধরবে
  const unreadCount = notifications.filter((item) => !readNotificationIds.includes(item.id)).length;

  // নামের প্রথম অক্ষর দিয়ে অবতারের শর্টকাট তৈরি
  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 relative">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100">
            <Sun className="w-4 h-4" />
          </button>

          {/* Notification Bell Button */}
          <button 
            onClick={handleOpenNotification}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100 relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin Profile Info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getInitials(adminData.fullName)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-800 uppercase">{adminData.fullName}</p>
              <p className="text-[10px] text-slate-400 font-medium">{adminData.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Modal / Drawer */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/25 backdrop-blur-2xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] mt-12 mr-2">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">
                  {notifications.length} Total
                </span>
              </div>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List Body */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                  No new notifications found.
                </div>
              ) : (
                notifications.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1 hover:bg-slate-100/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] font-semibold text-purple-600 px-2 py-0.5 bg-purple-50 rounded-md">
                        {item.priority || 'MEDIUM'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.body}
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;