"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FaceScanningStep from "../Components/FaceScanningStep";

export default function FaceScanPage() {
  const router = useRouter();

  // ফেস ভেরিফিকেশন বা রেজিস্ট্রেশন সফল হলে এখানে আসবে
  const handleVerified = () => {
    console.log("Face verified successfully! Redirecting to Location Check...");
    
    // ফেস স্ক্যান সফল হওয়ার পর লোকেশন চেক পেজে পাঠিয়ে দিন
    router.push("/employee/location-check"); // আপনার লোকেশন চেক পেজের রাউট পাথ এখানে দিন
  };

  const handleFail = () => {
    console.log("Face verification failed or cancelled.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <FaceScanningStep 
          onVerified={handleVerified} 
          onFail={handleFail} 
        />
      </div>
    </div>
  );
}