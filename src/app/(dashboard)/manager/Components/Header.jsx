'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Bell, X } from 'lucide-react';

const Header = ({ title }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState([]);

  // Hydration mismatch এড়াতে ইনিশিয়াল স্টেট ডিফল্ট রাখা হলো
  const [managerData, setManagerData] = useState({
    fullName: 'MANAGER',
    email: '',
    role: 'MANAGER'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setManagerData({
          fullName: parsed.fullName || 'MANAGER',
          email: parsed.email || '',
          role: parsed.role || 'MANAGER'
        });
      }
      
      const savedRead = localStorage.getItem('read_notifications');
      if (savedRead) {
        setReadNotificationIds(JSON.parse(savedRead));
      }
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch header notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handleNotificationRefresh = () => fetchNotifications();
    window.addEventListener('notificationCreated', handleNotificationRefresh);
    return () => window.removeEventListener('notificationCreated', handleNotificationRefresh);
  }, []);

  const handleOpenNotification = () => {
    setIsNotificationOpen(true);
    fetchNotifications();
    if (notifications.length > 0) {
      const allIds = notifications.map((item) => item.id);
      const updatedReadIds = Array.from(new Set([...readNotificationIds, ...allIds]));
      setReadNotificationIds(updatedReadIds);
      localStorage.setItem('read_notifications', JSON.stringify(updatedReadIds));
    }
  };

  const unreadCount = notifications.filter((item) => !readNotificationIds.includes(item.id) && !item.isRead).length;

  const getInitials = (name) => {
    if (!name || name === 'MANAGER') return 'MA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 relative">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-100">
            <Sun className="w-4 h-4" />
          </button>

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

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getInitials(managerData.fullName)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-800 uppercase">{managerData.fullName}</p>
              <p className="text-[10px] text-slate-400 font-medium">{managerData.role}</p>
            </div>
          </div>
        </div>
      </header>

      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/25 backdrop-blur-2xs p-4 sm:p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] mt-12 mr-2">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
              <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">No new notifications.</div>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    <p className="text-xs text-slate-600">{item.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;