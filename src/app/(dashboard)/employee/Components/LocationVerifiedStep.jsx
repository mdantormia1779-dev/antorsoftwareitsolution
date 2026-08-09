"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const LocationVerifiedStep = ({ onConfirm }) => {
  const handleConfirmCheckIn = () => {
    // ১. চেক-ইন স্ট্যাটাস true করা
    localStorage.setItem("isCheckedIn", JSON.stringify(true));
    
    // ২. বর্তমান টাইমস্ট্যাম্প সেভ করা (যেমন: 2026-08-07T10:00:00.000Z)
    localStorage.setItem("checkInTime", new Date().toISOString());

    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 transition-all duration-300">
      {/* Green Check Icon Circle */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center justify-center">
        <Check className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 stroke-3" />
      </div>

      {/* Success Details */}
      <div className="space-y-1.5 max-w-sm px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Location Verified
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
          You're inside the office radius. Face match 98%.
        </p>
      </div>

      {/* Confirm Check-In Button */}
      <div className="pt-2 w-full max-w-xs px-4">
        <Link
          href="/employee"
          onClick={handleConfirmCheckIn}
          className="w-full block text-center bg-[#00966d] hover:bg-[#00825e] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer text-sm"
        >
          Confirm Check-In
        </Link>
      </div>
    </div>
  );
};

export default LocationVerifiedStep;