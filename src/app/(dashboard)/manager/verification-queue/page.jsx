'use client';

import React, { useState } from 'react';
import { Check, X, Clock, MapPin, ScanFace } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const VerificationQueuePage = () => {
  // স্ক্রিনশটের তথ্য অনুযায়ী স্টেট
  const [queueItems, setQueueItems] = useState([
    {
      id: 1,
      name: 'Owen Marsh',
      initials: 'OM',
      avatarBg: 'bg-rose-600',
      branch: 'Westline Hub',
      matchScore: '54% match',
      isMatchGood: false,
      locationStatus: 'Outside radius',
      isLocationGood: false,
      time: '09:44 AM',
    },
    {
      id: 2,
      name: 'Isla Fontaine',
      initials: 'IF',
      avatarBg: 'bg-emerald-600',
      branch: 'Westline Hub',
      matchScore: '99% match',
      isMatchGood: true,
      locationStatus: 'Verified',
      isLocationGood: true,
      time: '09:47 AM',
    },
  ]);

  // Approve বা Reject করার পর কিউ থেকে সরানোর হ্যান্ডলার
  const handleAction = (id) => {
    setQueueItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          {queueItems.length} PENDING
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Verification Queue
        </h1>
      </div>

      {/* Queue List Cards */}
      <div className="space-y-3">
        {queueItems.length > 0 ? (
          queueItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-200/80 transition-all"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                {/* User Avatar */}
                <Avatar className={`h-11 w-11 ${item.avatarBg} text-white font-semibold shrink-0`}>
                  <AvatarFallback className={`${item.avatarBg} text-white font-bold text-xs`}>
                    {item.initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  {/* Name & Branch */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      · {item.branch}
                    </span>
                  </div>

                  {/* Badges / Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium">
                    {/* Face Match Score */}
                    <div className={`flex items-center gap-1 ${item.isMatchGood ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <ScanFace className="w-3.5 h-3.5" />
                      <span>{item.matchScore}</span>
                    </div>

                    {/* Location Status */}
                    <div className={`flex items-center gap-1 ${item.isLocationGood ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.locationStatus}</span>
                    </div>

                    {/* Check-In Time */}
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(item.id)}
                  className="p-2.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-600 transition-colors cursor-pointer"
                  title="Approve"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => handleAction(item.id)}
                  className="p-2.5 rounded-xl bg-rose-100/70 hover:bg-rose-200/70 text-rose-500 transition-colors cursor-pointer"
                  title="Reject"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-medium text-xs sm:text-sm">
            No pending verifications left in the queue.
          </div>
        )}
      </div>

    </div>
  );
};

export default VerificationQueuePage;