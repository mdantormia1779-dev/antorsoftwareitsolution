"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LocationVerifiedStep = ({ onConfirm }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirmCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User session not found. Please login again.");
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      if (!userId) {
        throw new Error("User ID not found.");
      }

      const lat = localStorage.getItem("userLat") || 24.3310;
      const lng = localStorage.getItem("userLng") || 91.4445;
      const checkInTimeISO = new Date().toISOString();

      // ১. ব্যাকএন্ডে কিউ-এর জন্য রিকোয়েস্ট পাঠানো
      const response = await fetch("/api/employee/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          locationStatus: "Verified",
          checkInTime: checkInTimeISO,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to submit check-in request.");
      }

      // ২. লোকালস্টোরেজে পেন্ডিং স্টেট এবং টাইমারের জন্য চেক-ইন টাইম সেভ করা
      // যাতে এমপ্লয়ী ড্যাশবোর্ডে গেলে দেখতে পায় যে রিকোয়েস্ট পেন্ডিং আছে এবং টাইমার চালু হয়েছে
      localStorage.setItem("isPendingApproval", "true");
      localStorage.setItem("checkInTime", checkInTimeISO);

      // ৩. সাকসেস মেসেজ দেখিয়ে ড্যাশবোর্ডে রিডাইরেক্ট করা
      alert("Check-in submitted successfully! Waiting for manager approval. Timer has started.");

      if (onConfirm) {
        onConfirm();
      } else {
        router.push("/employee");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setErrorMessage(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 transition-all duration-300 w-full">
      {/* Green Check Icon Circle */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center justify-center">
        <Check className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 stroke-3" />
      </div>

      {/* Success Details */}
      <div className="space-y-1.5 max-w-sm px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Location Verified
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
          You're inside the office radius. Face match 98%. Confirm to start your session while waiting for manager approval.
        </p>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="w-full max-w-xs px-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Confirm Check-In Button */}
      <div className="pt-2 w-full max-w-xs px-4">
        <button
          type="button"
          onClick={handleConfirmCheckIn}
          disabled={loading}
          className="w-full block text-center bg-[#00966d] hover:bg-[#00825e] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Timer & Queue...
            </span>
          ) : (
            "Confirm Check-In"
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationVerifiedStep;