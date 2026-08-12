"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LocationCheckStep from "../Components/LocationCheckStep";

export default function LocationCheckPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // লোকেশন সফলভাবে মিলে গেলে বা কমপ্লিট হলে এই ফাংশনটি রান হবে
  const handleInsideRadius = async (locationData) => {
    if (isProcessing) return;
    setIsProcessing(true);

    console.log("Location verified successfully inside radius:", locationData);

    try {
      // ১. ইউজার আইডি বের করা
      const userStr = localStorage.getItem("user");
      let userId = null;
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || user._id;
      }

      const checkInTimeISO = new Date().toISOString();

      // ২. ব্যাকএন্ডে চেক-ইন ও ওয়ার্কিং আওয়ার্স স্টার্ট করার রিকোয়েস্ট পাঠানো
      if (userId) {
        try {
          await fetch("/api/employee/check-in", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              checkInTime: checkInTimeISO,
              lat: locationData.userLat,
              lng: locationData.userLng,
            }),
          });
        } catch (apiErr) {
          console.error("Background API check-in error:", apiErr);
        }
      }

      // ৩. লোকালস্টোরেজে চেক-ইন স্টেট ও টাইম সেভ করা (যাতে ড্যাশবোর্ডের টাইমার স্টার্ট হয়)
      localStorage.setItem("isCheckedIn", JSON.stringify(true));
      localStorage.setItem("checkInTime", checkInTimeISO);

      console.log("Redirecting to http://localhost:3000/employee ...");

      // ৪. লোকেশন চেক সম্পন্ন হওয়ার সাথে সাথেই সরাসরি /employee পেজে রিডাইরেক্ট করা
      router.push("/employee");
      
    } catch (error) {
      console.error("Error during check-in completion:", error);
      setIsProcessing(false);
    }
  };

  // যদি বাইরে থাকে
  const handleOutsideRadius = (locationData) => {
    console.warn(`Outside office radius. Distance: ${locationData.distance}m`);
    alert(`You are outside the office radius (~${locationData.distance}m away). Please move closer.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <LocationCheckStep
          onInsideRadius={handleInsideRadius}
          onOutsideRadius={handleOutsideRadius}
        />
      </div>
    </div>
  );
}