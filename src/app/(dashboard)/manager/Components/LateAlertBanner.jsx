'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const LateAlertBanner = ({ initialData }) => {
  const [alertData, setAlertData] = useState(initialData || {
    name: 'Loading...',
    location: 'Loading...',
    time: '—',
    status: 'checking'
  });
  const [loading, setLoading] = useState(!initialData);

  // ব্যাকএন্ড থেকে লেটেস্ট লেট অ্যালার্ট ডাটা ফেচ করার ফাংশন
  const fetchLateAlert = async () => {
    try {
      const res = await fetch('/api/dashboard/late-alert'); // আপনার ব্যাকএন্ড API রুট দিন
      const result = await res.json();
      
      if (result.success && result.data) {
        setAlertData({
          name: result.data.name || 'Unknown Employee',
          location: result.data.location || 'Main Branch',
          time: result.data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: result.data.status || 'failed'
        });
      }
    } catch (error) {
      console.error('Failed to fetch late alert:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // যদি প্রপস থেকে ডাটা না আসে, তবে API থেকে ফেচ করবে
    if (!initialData) {
      fetchLateAlert();
    }
  }, [initialData]);

  if (loading) {
    return (
      <div className="bg-amber-50/40 border border-amber-200/40 rounded-2xl p-4 flex items-center justify-center gap-3 animate-pulse">
        <p className="text-xs text-amber-600 font-medium">Checking alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100/80 text-amber-600 rounded-xl shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {alertData.name} arrived late
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {alertData.location} · today at {alertData.time} · face verification status:{" "}
            <span className={`font-medium ${alertData.status === 'failed' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {alertData.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LateAlertBanner;