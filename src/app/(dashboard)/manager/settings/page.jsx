'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // প্রোফাইল ফর্ম স্টেট
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    avatar: null
  });

  // পাসওয়ার্ড চেঞ্জ ফর্ম স্টেট
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // লোকাল স্টোরেজ বা API থেকে ইউজার ডাটা লোড করা
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfileData({
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          role: parsed.role || 'MANAGER',
          avatar: parsed.avatar || null
        });
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
  }, []);

  // প্রোফাইল ইনপুট চেঞ্জ হ্যান্ডলার
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // পাসওয়ার্ড ইনপুট চেঞ্জ হ্যান্ডলার
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // ফটো সিলেকশন হ্যান্ডলার
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // প্রোফাইল আপডেট সাবমিট হ্যান্ডলার
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const result = await res.json();

      if (res.ok && (result.success !== false)) {
        // লোকাল স্টোরেজ আপডেট করা
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const updated = { ...parsed, ...profileData };
          localStorage.setItem('user', JSON.stringify(updated));
        }

        // হেডার বা অন্য কম্পোনেন্টে রিয়েল-টাইম আপডেটের জন্য ইভেন্ট ডিসপ্যাচ করা
        window.dispatchEvent(new Event('userUpdated'));
        setSuccessMessage('Profile updated successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // পাসওয়ার্ড পরিবর্তন সাবমিট হ্যান্ডলার
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileData.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok && (result.success !== false)) {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrorMessage(result.message || 'Failed to change password. Check your current password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Something went wrong while changing password.');
    } finally {
      setLoading(false);
    }
  };

  // নামের প্রথম অক্ষর দিয়ে অবতারের ফলব্যাক তৈরি
  const getInitials = (name) => {
    if (!name) return 'MA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          CONFIGURE YOUR WORKSPACE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Settings
        </h1>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => { setActiveTab('Profile'); setSuccessMessage(''); setErrorMessage(''); }}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'Profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => { setActiveTab('Password'); setSuccessMessage(''); setErrorMessage(''); }}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'Password'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Tab 1: Profile Settings Form */}
      {activeTab === 'Profile' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-6">

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address (Read-only)</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-400 bg-slate-100/60 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={profileData.role}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-400 bg-slate-100/60 cursor-not-allowed uppercase font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Change Password Form */}
      {activeTab === 'Password' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Change Password</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;