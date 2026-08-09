'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, Loader2 } from 'lucide-react';
import { getManagersAction } from '@/app/actions/branch';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CreateBranchModal = ({ isOpen, onClose, onCreate, organizations = [], initialOrgId = '' }) => {
  const initialFormState = {
    name: '',
    address: '',
    managerId: '', 
    organizationId: initialOrgId || '',
    geofenceRadius: '150',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    weeklyHolidays: ['Sat', 'Sun'],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // মোডাল ওপেন হলে অর্গানাইজেশন এবং ম্যানেজার লিস্ট সেট করা
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        address: '',
        managerId: '',
        organizationId: initialOrgId || (organizations.length > 0 ? organizations[0].id : ''),
        geofenceRadius: '150',
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        weeklyHolidays: ['Sat', 'Sun'],
      });
      
      async function fetchManagers() {
        setLoadingManagers(true);
        setErrorMessage('');
        try {
          const res = await getManagersAction();
          if (res?.success && res.data.length > 0) {
            setManagers(res.data);
            setFormData((prev) => ({ 
              ...prev, 
              managerId: prev.managerId || res.data[0].id 
            }));
          }
        } catch (err) {
          console.error('Failed to fetch managers:', err);
        } finally {
          setLoadingManagers(false);
        }
      }
      fetchManagers();
    }
  }, [isOpen, initialOrgId, organizations]);

  if (!isOpen) return null;

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
    setErrorMessage('');

    if (!formData.organizationId) {
      setErrorMessage('Please select an organization.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        organizationId: formData.organizationId,
        managerId: formData.managerId || null,
        geofenceRadius: parseInt(formData.geofenceRadius, 10) || 150,
        latitude: 23.7937,
        longitude: 90.4066,
        startTime: formData.startTime,
        endTime: formData.endTime,
        weeklyHolidays: formData.weeklyHolidays,
      };

      console.log("Sending Payload to API:", payload);

      if (onCreate) {
        // Parent থেকে আসা handleCreateBranch ফাংশন কল করা (যা API এ POST করবে)
        const result = await onCreate(payload); 
        console.log("Server Response:", result);

        if (result && result.success === false) {
          setErrorMessage(result.error || 'Failed to create branch.');
          return;
        }
      }
      
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Plus className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            <h3>Create Branch</h3>
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
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Select Organization */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Select Organization <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.organizationId}
              onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
            >
              <option value="">-- Choose an Organization --</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Name & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Branch name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Northgate Office"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Street, city, state"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Manager Select & Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Manager <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                disabled={loadingManagers}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer disabled:opacity-50"
              >
                {loadingManagers ? (
                  <option value="">Loading managers...</option>
                ) : managers.length > 0 ? (
                  managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))
                ) : (
                  <option value="">No managers found (Unassigned)</option>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Shift Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duty start time</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 pr-10"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duty end time</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 pr-10"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Weekly Holidays */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Weekly holidays</label>
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

          {/* Actions */}
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
                  Creating...
                </>
              ) : (
                'Create Branch'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateBranchModal;