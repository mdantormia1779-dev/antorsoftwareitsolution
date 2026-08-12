'use client';
import React, { useState, useEffect } from 'react';
import { Mail, Phone, UserCheck, LogOut, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('Failed to parse user data from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isCheckedIn');
    localStorage.removeItem('checkInTime');
    router.push('/'); // আপনার প্রজেক্টের লগইন পেজ রুট অনুযায়ী পরিবর্তন করতে পারেন
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center">
        <p className="text-slate-600 font-medium mb-4">No user data found. Please log in first.</p>
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ইউজারের পুরো নাম থেকে ইনিশিয়াল জেনারেট করা (যেমন: "Test User" -> "TU")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user.fullName);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Header / Avatar Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4">
          {/* Avatar Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md">
            {initials}
          </div>

          {/* Name & Role */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {user.fullName || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1.5 flex-wrap">
              <span>{user.designation || user.role}</span>
              {user.department && (
                <>
                  <span>·</span>
                  <span>{user.department}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium break-all">
              {user.email || 'N/A'}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {user.phone || 'N/A'}
            </span>
          </div>

          {/* Employee ID */}
          <div className="flex items-center gap-3 text-slate-600">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {user.empCode || 'N/A'}
            </span>
          </div>

          {/* Organization Name */}
          {user.organization?.name && (
            <div className="flex items-center gap-3 text-slate-600">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {user.organization.name}
              </span>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-rose-200 hover:bg-rose-50/50 text-rose-500 font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm sm:text-base cursor-pointer"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Log out</span>
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;