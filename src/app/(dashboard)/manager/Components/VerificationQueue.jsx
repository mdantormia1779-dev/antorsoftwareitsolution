'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Scan, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const VerificationQueue = () => {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. নামের প্রথম অক্ষর দিয়ে ইনিশিয়াল তৈরি করার ফাংশনটি সবার উপরে রাখা হলো
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // ব্যাকএন্ড থেকে পেন্ডিং ভেরিফিকেশন কিউ ফেচ করা
  const fetchVerificationQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/verification-queue?status=PENDING');
      const result = await res.json();
      
      if (result.success && result.data) {
        const formatted = result.data.map((item) => {
          const userName = item.user?.fullName || item.user?.name || 'Unknown Employee';
          const matchScoreNum = item.faceMatchScore ?? item.matchScore ?? 85;
          const isFailedMatch = matchScoreNum < 70;
          const isOutside = item.isOutsideRadius ?? false;

          return {
            id: item.id,
            name: userName,
            initials: getInitials(userName), // এখন ফাংশনটি সঠিকভাবে কাজ করবে
            avatarBg: isFailedMatch ? 'bg-rose-600' : 'bg-emerald-600',
            location: item.branch?.name || item.location || 'Main Hub',
            matchScore: `${matchScoreNum}% match`,
            matchStatus: isFailedMatch ? 'failed' : 'success',
            radiusStatus: isOutside ? 'Outside radius' : 'Verified',
            radiusFailed: isOutside,
            time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });

        setQueueData(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch verification queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationQueue();

    const interval = setInterval(fetchVerificationQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            Awaiting Approval
          </span>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Verification Queue
          </h3>
        </div>

        <Link
          href="/manager/verification-queue"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-all"
        >
          <span>View all</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            Loading verification queue...
          </div>
        ) : queueData.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium">
            No items awaiting approval.
          </div>
        ) : (
          queueData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100/80 bg-white hover:border-slate-200 transition-all gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className={`h-10 w-10 ${item.avatarBg} text-white font-semibold shrink-0`}>
                  <AvatarFallback className={`${item.avatarBg} text-white text-xs`}>
                    {item.initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      {item.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-normal">
                      · {item.location}
                    </span>
                  </div>

                  {/* Sub Metadata Tags */}
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                    {/* Face Match Badge */}
                    <span className={`inline-flex items-center gap-1 ${
                      item.matchStatus === 'failed' ? 'text-rose-500' : 'text-emerald-600'
                    }`}>
                      <Scan className="w-3.5 h-3.5" />
                      {item.matchScore}
                    </span>

                    {/* Radius Badge */}
                    <span className={`inline-flex items-center gap-1 ${
                      item.radiusFailed ? 'text-rose-500' : 'text-emerald-600'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                      {item.radiusStatus}
                    </span>

                    {/* Time Badge */}
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerificationQueue;