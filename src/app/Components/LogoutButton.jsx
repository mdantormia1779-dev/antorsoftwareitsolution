"use client";

import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton({ className = "", showText = true }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title="Logout"
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500 shrink-0" />
      ) : (
        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
      )}
      
      {showText && (
        <span>{loading ? "Logging out..." : "Logout"}</span>
      )}
    </button>
  );
}