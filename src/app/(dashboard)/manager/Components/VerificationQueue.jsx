'use client';

import React from 'react';
import { ChevronRight, Scan, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const VerificationQueue = ({ items }) => {
  // ডিফাক্ট ডাটা
  const queueData = items || [
    {
      id: 1,
      name: 'Owen Marsh',
      initials: 'OM',
      avatarBg: 'bg-rose-600',
      location: 'Westline Hub',
      matchScore: '54% match',
      matchStatus: 'failed', // failed
      radiusStatus: 'Outside radius',
      radiusFailed: true,
      time: '09:44 AM'
    },
    {
      id: 2,
      name: 'Isla Fontaine',
      initials: 'IF',
      avatarBg: 'bg-emerald-600',
      location: 'Westline Hub',
      matchScore: '99% match',
      matchStatus: 'success', // success
      radiusStatus: 'Verified',
      radiusFailed: false,
      time: '09:47 AM'
    }
  ];

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
        {queueData.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default VerificationQueue;