"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const WorkTimer = () => {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    const checkInTimeStr = localStorage.getItem("checkInTime");
    if (!checkInTimeStr) return;

    const checkInTime = new Date(checkInTimeStr).getTime();

    // প্রতি ১ সেকেন্ড পরপর টাইম হিসাব করে আপডেট করবে
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diffInMs = Math.max(0, now - checkInTime);

      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      // ২ ডিজিটের ফরম্যাটে রূপান্তর (যেমন: 01:05:09)
      const formatted = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      setElapsedTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-sm font-semibold">
      <Clock className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: "3s" }} />
      <span>{elapsedTime}</span>
    </div>
  );
};

export default WorkTimer;