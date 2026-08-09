'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Clock, MapPin, ShieldCheck, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const AttendancePage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timerText, setTimerText] = useState("00:00:00");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateAttendanceTimer = () => {
      const savedCheckedIn = localStorage.getItem("isCheckedIn") === "true";
      const savedCheckInTime = localStorage.getItem("checkInTime");

      setIsCheckedIn(savedCheckedIn);

      if (savedCheckedIn && savedCheckInTime) {
        // ১. চেক-ইন করা থাকলে: লাইভ টাইমার কাউন্ট শুরু হবে
        const start = new Date(savedCheckInTime).getTime();
        const now = new Date().getTime();
        const diffMs = Math.max(0, now - start);

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setTimerText(formatted);
      } else {
        // ২. চেক-ইন না থাকলে: ফিক্সড 00:00:00 থাকবে
        setTimerText("00:00:00");
      }
    };

    updateAttendanceTimer();
    const interval = setInterval(updateAttendanceTimer, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // চেক-ইন / চেক-আউট বাটন অ্যাকশন
  const handleCheckAction = () => {
    if (!isCheckedIn) {
      router.push('/employee/facescan');
    } else {
      localStorage.setItem("isCheckedIn", "false");
      localStorage.removeItem("checkInTime");
      setIsCheckedIn(false);
      setTimerText("00:00:00");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mark your attendance with live verification
          </p>
        </div>

        {/* Shift Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Duty Shift: 09:00 AM - 06:00 PM</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              
              {/* Timer Display */}
              <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-800 tracking-tight font-mono">
                {timerText}
              </div>
              
              {/* Dynamic Status Text */}
              {isCheckedIn ? (
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2 mb-8">
                  Timer running
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2 mb-8">
                  Not checked in
                </p>
              )}

              {/* Action Button */}
              <Button 
                onClick={handleCheckAction}
                className={`w-full sm:max-w-md text-white py-6 sm:py-7 rounded-xl text-base sm:text-lg font-semibold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
                  isCheckedIn 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {isCheckedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    Check Out
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Check In
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-slate-100 shadow-sm rounded-2xl bg-white p-4 flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Office Location</p>
                <p className="text-sm font-semibold text-slate-700">Meridian HQ (Main Office)</p>
              </div>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-2xl bg-white p-4 flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Verification Mode</p>
                <p className="text-sm font-semibold text-slate-700">Face Recognition + GPS</p>
              </div>
            </Card>
          </div>

        </div>

        {/* Right Column: Status Checklist */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Verification Status
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 divide-y divide-slate-100">
                {/* Face verification */}
                <div className="flex items-center justify-between py-4 first:pt-0">
                  <span className="text-sm font-medium text-slate-600">
                    Face verification
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    isCheckedIn 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {isCheckedIn ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Location
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    isCheckedIn 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {isCheckedIn ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* Attendance recorded */}
                <div className="flex items-center justify-between py-4 last:pb-0">
                  <span className="text-sm font-medium text-slate-600">
                    Attendance recorded
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    isCheckedIn 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-slate-100 text-slate-500 border-transparent"
                  }`}>
                    {isCheckedIn ? "Yes" : "Not yet"}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default AttendancePage;