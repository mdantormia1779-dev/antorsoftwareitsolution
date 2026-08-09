"use client";

import React, { useState, useEffect } from "react";
import { Camera, LogOut, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WorkTimer from "./WorkTimer";

const CheckInCard = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [checkInTimeFormatted, setCheckInTimeFormatted] = useState("");

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("isCheckedIn");
      return savedState !== null ? JSON.parse(savedState) : false;
    }
    return false;
  });

  useEffect(() => {
    setMounted(true);

    // চেক-ইন টাইম ফরম্যাট করা (যেমন: 09:30 AM)
    const savedTime = localStorage.getItem("checkInTime");
    if (savedTime) {
      const formatted = new Date(savedTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCheckInTimeFormatted(formatted);
    }
  }, [isCheckedIn]);

  const handleButtonClick = () => {
    if (!isCheckedIn) {
      router.push("/employee/facescan");
    } else {
      setIsCheckedIn(false);
      localStorage.setItem("isCheckedIn", JSON.stringify(false));
      localStorage.removeItem("checkInTime");
      setCheckInTimeFormatted("");
    }
  };

  if (!mounted) return null;

  return (
    <Card className="border-slate-100/80 shadow-sm rounded-2xl bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Today's Status
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {isCheckedIn ? "Checked In" : "Not Checked In"}
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isCheckedIn
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}
          >
            {isCheckedIn ? "On Duty" : "Pending"}
          </span>
        </div>

        {/* 🔹 আপডেটেড লোকেশন, চেক-ইন টাইম ও লাইভ টাইমার সেকশন */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {isCheckedIn && checkInTimeFormatted
                ? `Meridian HQ · Checked in at ${checkInTimeFormatted}`
                : "Meridian HQ · Duty starts 09:00 AM"}
            </span>
          </p>

          {/* লাইভ টাইম কাউন্টার */}
          {isCheckedIn && <WorkTimer />}
        </div>

        <div className="flex justify-center sm:justify-start">
          <Button
            onClick={handleButtonClick}
            className={`w-full sm:w-auto text-white px-8 py-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
              isCheckedIn
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isCheckedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                Check Out Now
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