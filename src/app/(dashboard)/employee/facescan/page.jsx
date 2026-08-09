"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import FaceScanningStep from "../Components/FaceScanningStep";
import LocationCheckStep from "../Components/LocationCheckStep";
import LocationVerifiedStep from "../Components/LocationVerifiedStep";
import VerificationFailedStep from "../Components/VerificationFailedStep";


const AttendanceCheckPage = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("scanning"); // 'scanning' | 'location' | 'success' | 'failed'

  // ১. ফেস স্ক্যান প্রোগ্রেস অ্যানিমেশন (০% থেকে ১০০%)
  useEffect(() => {
    if (step !== "scanning") return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStep("location"), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [step]);

  // রিসেট/ট্রাই এগেইন ফাংশন
  const handleReset = () => {
    setProgress(0);
    setStep("scanning");
  };

  // চেক-ইন নিশ্চিত করার অ্যালার্ট
  const handleConfirmCheckIn = () => {
    alert("Check-In Successful! 🎉");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans select-none">
      
      {/* Top Header / Back Button */}
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={() => {
            if (step === "scanning") {
              window.history.back();
            } else {
              handleReset();
            }
          }}
          className="p-2 rounded-full hover:bg-slate-200/60 transition-colors text-slate-500 hover:text-slate-800 cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Dynamic Content Area Based on Current Step */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-12 text-center w-full max-w-4xl mx-auto">
        {step === "scanning" && (
          <FaceScanningStep
            progress={progress}
            onFail={() => setStep("failed")}
          />
        )}

        {step === "location" && (
          <LocationCheckStep
            onInsideRadius={() => setStep("success")}
            onOutsideRadius={() => setStep("failed")}
          />
        )}

        {step === "success" && (
          <LocationVerifiedStep onConfirm={handleConfirmCheckIn} />
        )}

        {step === "failed" && (
          <VerificationFailedStep
            onReset={handleReset}
            onCancel={() => window.history.back()}
          />
        )}
      </div>

      {/* Bottom Spacer for Layout Alignment */}
      <div className="w-full max-w-4xl mx-auto opacity-0 pointer-events-none">
        <ChevronLeft className="w-6 h-6" />
      </div>

    </div>
  );
};

export default AttendanceCheckPage;