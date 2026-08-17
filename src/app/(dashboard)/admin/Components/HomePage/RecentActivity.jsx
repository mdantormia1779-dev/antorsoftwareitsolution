'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  LogOut,
  ScanFace,
  Building2,
  AlertTriangle,
} from 'lucide-react';

const RecentActivity = ({ organizationId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        let url = `${apiUrl}/dashboard/activities`;
        if (organizationId) {
          url += `?organizationId=${organizationId}`;
        }

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        });

        // যদি রেসপন্স জেসন না হয়ে HTML বা অন্য কিছু আসে (যেমন 404 ত্রুটি)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from server");
        }

        const result = await res.json();

        if (res.ok && (result.success || result.data)) {
          const rawData = result.data || result;
          
          // ব্যাকএন্ডের ডেটাকে কম্পোনেন্টের কাঠামোর সাথে ম্যাপ করা হলো
          const formatted = rawData.map((item, index) => ({
            id: item.id || index,
            boldText: item.user || 'User',
            normalText: item.action || 'performed an action',
            meta: item.time ? new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            iconType: item.status === 'PRESENT' ? 'scan' : 'check',
            iconBg: item.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
          }));

          setActivities(formatted);
        }
      } catch (error) {
        console.error('Failed to load recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [apiUrl, organizationId]);

  // আইকন ম্যাপিং হেল্পার
  const getIconComponent = (type) => {
    switch (type) {
      case 'logout':
        return LogOut;
      case 'scan':
        return ScanFace;
      case 'alert':
        return AlertTriangle;
      case 'building':
        return Building2;
      default:
        return Check;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            LIVE FEED
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Recent Activity
          </h2>
        </div>
        {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Syncing...</span>}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {loading && activities.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            Loading recent activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            No recent activity found.
          </div>
        ) : (
          activities.map((item) => {
            const IconComponent = getIconComponent(item.iconType);
            return (
              <div key={item.id} className="flex items-center gap-3.5 group">
                
                {/* Rounded Square Icon Box */}
                <div
                  className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                >
                  <IconComponent className="w-4 h-4 stroke-[2.2]" />
                </div>

                {/* Text & Meta Subtext */}
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm text-slate-600">
                    <span className="font-bold text-slate-800">
                      {item.boldText}
                    </span>{' '}
                    <span className="font-medium text-slate-600">
                      {item.normalText}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.meta}
                  </p>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default RecentActivity;