'use client';

import React, { useState, useEffect } from 'react';

const LiveTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড API থেকে লাইভ টাইমলাইন ডাটা ফেচ করা (সেফ হ্যান্ডলিং সহ)
  const fetchTimelineEvents = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await fetch('/api/dashboard/live-timeline');
      
      // চেক করা রেসপন্সটি JSON কিনা (HTML 404 ক্রাশ এড়াতে)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API route not found or returned non-JSON response.');
      }

      const result = await res.json();
      
      if (result.success && result.data) {
        setTimelineEvents(result.data);
      } else {
        setTimelineEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch live timeline:', error.message);
      setTimelineEvents([]);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    // প্রথমবার লোড করার সময় loading দেখাবে
    fetchTimelineEvents(true);

    // প্রতি ২০ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে অটো রিফ্রেশ (ফ্লিকার করবে না)
    const interval = setInterval(() => fetchTimelineEvents(false), 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          Today
        </span>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Live Timeline
        </h3>
      </div>

      {/* Timeline Tree */}
      <div className="relative pl-3 space-y-6 before:absolute before:left-[17px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-100">
        {loading ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            Loading timeline...
          </div>
        ) : timelineEvents.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No live activity found for today.
          </div>
        ) : (
          timelineEvents.map((item) => (
            <div key={item.id} className="relative flex items-start gap-4 z-10">
              {/* Status Dot */}
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ring-4 ring-white ${
                  item.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />

              {/* Content */}
              <div className="text-xs sm:text-sm">
                <span className="text-slate-400 font-medium mr-2">
                  {item.time}
                </span>
                <span className="text-slate-700 font-medium">
                  {item.text}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveTimeline;