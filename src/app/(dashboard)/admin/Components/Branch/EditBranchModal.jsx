'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, X, Clock, Loader2 } from 'lucide-react';
import { getManagersAction } from '@/app/actions/branch'; // ম্যানেজারদের ডাটাবেজ থেকে ফেচ করার জন্য

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EditBranchModal = ({ isOpen, onClose, branch, onSave }) => {
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    managerId: '', // manager পরিবর্তন করে managerId করা হলো
    geofenceRadius: '150',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    weeklyHolidays: ['Sat', 'Sun'],
  });

  // ১. মোডাল ওপেন হলে কারেন্ট ব্রাঞ্চের তথ্য ফর্মে সেট করা
  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        address: branch.address || branch.location || '',
        managerId: branch.managerId || branch.manager?.id || '', // সঠিক ম্যানেজার আইডি বা রিলেশন আইডি ম্যাপ করা
        geofenceRadius: branch.geofenceRadius?.toString() || '150',
        startTime: branch.startTime || '09:00 AM',
        endTime: branch.endTime || '06:00 PM',
        weeklyHolidays: Array.isArray(branch.weeklyHolidays) 
          ? branch.weeklyHolidays 
          : ['Sat', 'Sun'],
      });
    }
  }, [branch]);

  // ২. মোডাল ওপেন হলে ডাটাবেজ থেকে ম্যানেজারদের ফেচ করা
  useEffect(() => {
    if (isOpen) {
      async function fetchManagers() {
        setLoadingManagers(true);
        const res = await getManagersAction();
        if (res?.success && res?.data) {
          setManagers(res.data);
        }
        setLoadingManagers(false);
      }
      fetchManagers();
    }
  }, [isOpen]);

  if (!isOpen || !branch) return null;

  // সাপ্তাহিক ছুটির দিন টগল করা
  const toggleHoliday = (day) => {
    setFormData((prev) => {
      const isSelected = prev.weeklyHolidays.includes(day);
      return {
        ...prev,
        weeklyHolidays: isSelected
          ? prev.weeklyHolidays.filter((d) => d !== day)
          : [...prev.weeklyHolidays, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        geofenceRadius: parseInt(formData.geofenceRadius, 10), // নিশ্চিত করুন এটি একটি Number
      };

      await onSave(branch.id, payload); // ID এবং ডাটা আলাদাভাবে পাস করুন
      onClose();
    } catch (err) {
      console.error('Error updating branch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Pencil className="w-4 h-4 text-blue-600" />
            <h3>Edit {branch.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Row 1: Branch Name & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Branch name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Row 2: Manager & Geofencing Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Manager
              </label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                disabled={loadingManagers}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 cursor-pointer disabled:opacity-60"
              >
                <option value="">Select Manager</option>
                {loadingManagers ? (
                  <option value="" disabled>Loading managers...</option>
                ) : managers.length > 0 ? (
                  managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No managers found</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Geofencing radius (m) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.geofenceRadius}
                onChange={(e) => setFormData({ ...formData, geofenceRadius: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Row 3: Duty Start Time & Duty End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Duty start time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 pr-10"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Duty end time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 pr-10"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 4: Weekly Holidays */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Weekly holidays
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const isSelected = formData.weeklyHolidays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleHoliday(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBranchModal;