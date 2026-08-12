'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, MapPin, ScanFace, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const VerificationQueuePage = () => {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // ১. ব্যাকএন্ড থেকে পেন্ডিং ভেরিফিকেশন কিউ ফেচ করা
  const fetchQueue = useCallback(async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = loggedInUser.id || loggedInUser._id || '';

      const res = await fetch(`/api/verification-queue?status=PENDING&userId=${userId}`, {
        cache: 'no-store'
      });
      const result = await res.json();
      
      const rawList = Array.isArray(result) ? result : (result.data || []);

      if (Array.isArray(rawList)) {
        const formatted = rawList.map((item, index) => {
          const fullName = item.user?.fullName || 'Unknown User';
          const nameParts = fullName.trim().split(' ');
          let initials = 'UU';
          if (nameParts.length >= 2) {
            initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
          } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            initials = nameParts[0].substring(0, 2).toUpperCase();
          }

          const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-violet-600', 'bg-amber-600'];

          const timeString = item.createdAt 
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '—';

          return {
            id: item.id,
            name: fullName,
            initials: initials,
            avatarBg: bgColors[index % bgColors.length],
            branch: item.branch?.name || 'Main Branch',
            matchScore: item.matchScore ? `${item.matchScore}% match` : 'N/A',
            isMatchGood: item.matchScore ? item.matchScore >= 80 : true,
            locationStatus: item.locationStatus || 'Verified',
            isLocationGood: item.locationStatus === 'Verified',
            time: timeString,
          };
        });

        setQueueItems(formatted);
      }
    } catch (error) {
      console.error('Error fetching verification queue:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    // প্রতি ১০ সেকেন্ড পর পর কিউ অটো রিফ্রেশ হবে
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // ২. Approve বা Reject হ্যান্ডলার
  const handleAction = async (queueId, status) => {
    try {
      setActionLoadingId(queueId);

      // 'userInfo' এর বদলে সঠিক കീ 'user' ব্যবহার করা হয়েছে
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const decidedBy = loggedInUser.id || loggedInUser._id || ''; 

      const res = await fetch('/api/verification-queue', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queueId,
          status, // "APPROVED" অথবা "REJECTED"
          decidedBy,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // সফলভাবে আপডেট হলে লোকাল স্টেট থেকে রিমুভ করে দেওয়া
        setQueueItems((prev) => prev.filter((item) => item.id !== queueId));
      } else {
        alert(result.message || 'Action failed!');
      }
    } catch (error) {
      console.error('Error updating queue status:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
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
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading pending verifications...
          </div>
        ) : queueItems.length > 0 ? (
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
                  onClick={() => handleAction(item.id, 'APPROVED')}
                  disabled={actionLoadingId === item.id}
                  className="p-2.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Approve"
                >
                  {actionLoadingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
                <button
                  onClick={() => handleAction(item.id, 'REJECTED')}
                  disabled={actionLoadingId === item.id}
                  className="p-2.5 rounded-xl bg-rose-100/70 hover:bg-rose-200/70 text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                  title="Reject"
                >
                  {actionLoadingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <X className="w-4 h-4 stroke-[2.5]" />
                  )}
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