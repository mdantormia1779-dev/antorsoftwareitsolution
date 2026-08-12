"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Camera,
  LogOut,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WorkTimer from "./WorkTimer";

const CheckInCard = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  // =====================================================
  // GET CURRENT USER
  // =====================================================
  const getCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Failed to read user:", error);
      return null;
    }
  }, []);

  // =====================================================
  // FETCH ATTENDANCE STATUS
  // =====================================================
  const fetchAttendanceStatus = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        const localCheckedIn = localStorage.getItem("isCheckedIn") === "true";
        const localCheckInTime = localStorage.getItem("checkInTime");
        if (localCheckedIn && localCheckInTime) {
          setIsCheckedIn(true);
          setCheckInTime(localCheckInTime);
        }
      }

      const user = getCurrentUser();
      if (!user) {
        if (isInitialLoad) setLoading(false);
        return;
      }

      const userId = user.id || user._id;
      if (!userId) {
        if (isInitialLoad) setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/employee/attendance-status?userId=${encodeURIComponent(userId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Attendance API failed: ${response.status}`);
      }

      const data = await response.json();

      // যদি ব্যাকএন্ড থেকে চেক-আউট পাওয়া যায় অথবা চেক-ইন ফলস হয়
      const hasCheckedOut = data.attendance?.checkOut || data.data?.checkOut;
      const checkedInStatus = 
        !hasCheckedOut && (
          data.isCheckedIn ?? 
          data.data?.isCheckedIn ?? 
          (data.attendance && !data.attendance.checkOut)
        );

      const activeCheckInTime = 
        data.checkInTime ?? 
        data.data?.checkInTime ?? 
        data.attendance?.checkIn;

      if (data.success && checkedInStatus && activeCheckInTime) {
        setIsCheckedIn(true);
        setCheckInTime(activeCheckInTime);

        localStorage.setItem("isCheckedIn", "true");
        localStorage.setItem("checkInTime", activeCheckInTime);
      } else {
        // যদি চেক-আউট হয়ে গিয়ে থাকে বা একটিভ চেক-ইন না থাকে
        setIsCheckedIn(false);
        setCheckInTime(null);

        localStorage.setItem("isCheckedIn", "false");
        localStorage.removeItem("checkInTime");
      }
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
      
      const localCheckedIn = localStorage.getItem("isCheckedIn") === "true";
      const localCheckInTime = localStorage.getItem("checkInTime");

      if (localCheckedIn && localCheckInTime) {
        setIsCheckedIn(true);
        setCheckInTime(localCheckInTime);
      } else {
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [getCurrentUser]);

  // =====================================================
  // INITIAL LOAD & AUTO REFRESH
  // =====================================================
  useEffect(() => {
    setMounted(true);
    fetchAttendanceStatus(true);

    const interval = setInterval(() => {
      fetchAttendanceStatus(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchAttendanceStatus]);

  // =====================================================
  // CHECK IN
  // =====================================================
  const handleCheckIn = () => {
    router.push("/employee/facescan");
  };

  // =====================================================
  // CHECK OUT
  // =====================================================
  const handleCheckOut = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        alert("User session not found. Please login again.");
        return;
      }

      const userId = user.id || user._id;
      if (!userId) {
        alert("User ID not found.");
        return;
      }

      const confirmed = window.confirm("Are you sure you want to check out?");
      if (!confirmed) return;

      setActionLoading(true);

      const response = await fetch("/api/employee/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to check out.");
      }

      // স্টেট ও লোকালস্টোরেজ তৎক্ষণাৎ ক্লিয়ার করা
      setIsCheckedIn(false);
      setCheckInTime(null);

      localStorage.setItem("isCheckedIn", "false");
      localStorage.removeItem("checkInTime");

      await fetchAttendanceStatus(false);
      
      alert("Checked out successfully!");
      router.refresh();
    } catch (error) {
      console.error("Check-out error:", error);
      alert(error?.message || "Something went wrong while checking out.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (loading || actionLoading) return;
    if (!isCheckedIn) {
      handleCheckIn();
    } else {
      handleCheckOut();
    }
  };

  if (!mounted) return null;

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left Side: Status & Timer */}
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
            Today's status
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {loading
              ? "Checking..."
              : isCheckedIn
              ? "Checked In"
              : "Not Checked In"}
          </h2>

          {/* Working Timer below title when checked in */}
          {isCheckedIn && checkInTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <span>Working for</span>
              <WorkTimer checkInTime={checkInTime} />
            </div>
          )}
        </div>

        {/* Right Side: Action Button */}
        <div>
          <Button
            onClick={handleButtonClick}
            disabled={loading || actionLoading}
            variant="ghost"
            className={`text-xs sm:text-sm font-semibold flex items-center gap-2 px-4 py-2 h-auto rounded-xl transition-all cursor-pointer ${
              isCheckedIn
                ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : isCheckedIn ? (
              <>
                <LogOut className="w-4 h-4 text-slate-600" />
                Check Out
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Check In Now
              </>
            )}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default CheckInCard;