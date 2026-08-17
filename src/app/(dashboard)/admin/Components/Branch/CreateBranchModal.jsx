'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

const CreateBranchModal = ({ isOpen, onClose, onCreate, organizations = [], initialOrgId = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    managerId: '', 
    organizationId: '',
    geofenceRadius: '150',
    phone: '+8801800000000',
  });

  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      const defaultOrgId = initialOrgId || (organizations.length > 0 ? organizations[0].id : '');
      
      setFormData({
        name: '',
        address: '',
        managerId: '', 
        organizationId: defaultOrgId,
        geofenceRadius: '150',
        phone: '+8801800000000',
      });
      setErrorMessage('');
      
      async function fetchAvailableManagers() {
        setLoadingManagers(true);
        try {
          // এক সাথে ইউজার্স এবং ব্রাঞ্চগুলো ফেচ করা হচ্ছে যাতে কোন ম্যানেজার কোন ব্রাঞ্চে আছে তা চেক করা যায়
          const [usersRes, branchesRes] = await Promise.all([
            fetch(`${apiUrl}/users`, { method: "GET", credentials: "include", headers: getAuthHeaders() }),
            fetch(`${apiUrl}/branches`, { method: "GET", credentials: "include", headers: getAuthHeaders() })
          ]);

          const usersResult = await usersRes.json();
          const branchesResult = await branchesRes.json();
          
          if (!isMounted) return;

          const usersList = usersResult.data || usersResult || [];
          const branchesList = branchesResult.data || branchesResult || [];

          // যেসব ইউজারের আইডি অলরেডি কোনো ব্রাঞ্চের managerId হিসেবে আছে তাদের আইডি কালেক্ট করা
          const assignedManagerIds = new Set(
            branchesList
              .map((branch) => branch.managerId || branch.manager?.id)
              .filter(Boolean)
          );

          // শুধু ম্যানেজার রোল ফিল্টার করা এবং যারা অলরেডি অ্যাসাইনড তাদের বাদ দেওয়া
          const availableManagers = usersList.filter((user) => {
            const isManager = user.role && user.role.toUpperCase() === 'MANAGER';
            const isNotAssigned = !assignedManagerIds.has(user.id);
            return isManager && isNotAssigned;
          });

          if (usersRes.ok) {
            setManagers(availableManagers);
          } else {
            setManagers([]);
          }
        } catch (err) {
          console.error('Failed to fetch managers or branches:', err);
        } finally {
          if (isMounted) {
            setLoadingManagers(false);
          }
        }
      }
      fetchAvailableManagers();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialOrgId, organizations, apiUrl]);

  if (!isOpen) return null;

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
        latitude: 23.7937,
        longitude: 90.4066,
        geofenceRadius: parseInt(formData.geofenceRadius, 10) || 150,
        phone: formData.phone || "+8801800000000",
        managerId: formData.managerId ? formData.managerId : null,
        organizationId: formData.organizationId,
      };

      if (onCreate) {
        const result = await onCreate(payload); 

        if (result && result.success === false) {
          setErrorMessage(result.error || 'Failed to create branch.');
          setIsSubmitting(false);
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
                placeholder="e.g. Headquarters - Dhaka"
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
                placeholder="e.g. Banani, Dhaka"
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
                Manager
              </label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                disabled={loadingManagers}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Manager (Optional)</option>
                {loadingManagers ? (
                  <option value="" disabled>Loading managers...</option>
                ) : managers.length > 0 ? (
                  managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No available managers found</option>
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

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
            <input
              type="text"
              placeholder="+8801800000000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
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