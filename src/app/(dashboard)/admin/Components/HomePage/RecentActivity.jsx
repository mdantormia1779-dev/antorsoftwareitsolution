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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const url = organizationId
          ? `/api/dashboard/activities?organizationId=${organizationId}`
          : '/api/dashboard/activities';

        const res = await fetch(url);
        const result = await res.json();

        if (result.success && result.data.length > 0) {
          setActivities(result.data);
        } else {
          // যদি ডাটাবেজে কোনো ডাটা না থাকে তবে ফলব্যাক বা ডিফল্ট ডেমো ডাটা দেখাতে পারেন
          setActivities([]);
        }
      } catch (error) {
        console.error('Failed to load recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [organizationId]);

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