'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, X, Loader2 } from 'lucide-react';

const EditEmployeeModal = ({ isOpen, onClose, employee, onSave, branches = [], organizations = [] }) => {
  const [formData, setFormData] = useState({
    organizationId: '',
    branchId: '',
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE',
    departmentId: '',
    designationId: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // সিলেক্ট করা এমপ্লয়ির ডাটা ফর্মে সেট করা
  useEffect(() => {
    if (employee) {
      setFormData({
        organizationId: employee.organizationId || (organizations.length > 0 ? (organizations[0].id || organizations[0]._id) : ''),
        branchId: employee.branchId || (branches.length > 0 ? (branches[0].id || branches[0]._id) : ''),
        employeeId: employee.employeeId || employee.empCode || '',
        fullName: employee.fullName || employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        password: '', // সিকিউরিটি বা এডিটিংয়ের সুবিধার জন্য পাসওয়ার্ড খালি রাখা হয়, নতুন দিতে চাইলে ইউজার টাইপ করবে
        role: employee.role || 'EMPLOYEE',
        departmentId: employee.departmentId || '',
        designationId: employee.designationId || '',
      });
      setErrorMsg('');
    }
  }, [employee, branches, organizations]);

  if (!isOpen || !employee) return null;

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // সঠিক আইডি নিশ্চিত করা (_id অথবা id)
    const employeeIdKey = employee.id || employee._id;

    // AddEmployeeModal এর সাথে মিলিয়ে আপডেট পেলোড তৈরি করা হলো
    const updatedEmployee = {
      organizationId: formData.organizationId,
      branchId: (formData.role === 'EMPLOYEE' || formData.role === 'MANAGER') && formData.branchId ? formData.branchId : null,
      employeeId: formData.employeeId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      ...(formData.password && { password: formData.password }), // পাসওয়ার্ড দেওয়া হলে কেবল তখনই পে-লোডে যোগ হবে
      role: formData.role,
      departmentId: formData.departmentId || null,
      designationId: formData.designationId || null,
    };

    try {
      console.log('Saving updated employee data:', updatedEmployee);
      
      // onSave ফাংশনটি কল করা (যা Add/Edit উভয়ের ক্ষেত্রেই একই রিকোয়েস্ট স্ট্রাকচার মেইনটেইন করবে)
      const result = await onSave(employeeIdKey, updatedEmployee);

      // result যদি অবজেক্ট আকারে success/error রিটার্ন করে অথবা সরাসরি সাকসেস হয়
      if (!result || result.success !== false) {
        onClose();
      } else {
        setErrorMsg(result?.error || 'Failed to update employee.');
      }
    } catch (error) {
      console.error('Error in onSave callback:', error);
      setErrorMsg(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Pencil className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            <h3>Edit Employee Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Organization Selection Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Organization *</label>
            <select
              required
              value={formData.organizationId}
              onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <option key={org.id || org._id} value={org.id || org._id}>
                    {org.name || org.title || (org.id || org._id)}
                  </option>
                ))
              ) : (
                <option value={formData.organizationId}>Default Organization</option>
              )}
            </select>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Md Antor Mia"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Phone & Employee ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
              <input
                type="text"
                placeholder="+8801700000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password & Access Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Access Role <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setFormData({
                    ...formData,
                    role: newRole,
                    branchId: newRole === 'EMPLOYEE' && branches.length > 0 ? (branches[0].id || branches[0]._id) : '',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer focus:outline-none focus:border-indigo-500"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* Assigned Branch & Department ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Branch</label>
              {formData.role === 'EMPLOYEE' || formData.role === 'MANAGER' ? (
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Branch (Optional)</option>
                  {branches.length > 0 ? (
                    branches.map((b) => (
                      <option key={b.id || b._id} value={b.id || b._id}>
                        {b.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No branches available</option>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value="N/A (Admin)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-400 font-medium bg-slate-100 cursor-not-allowed"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department ID</label>
              <input
                type="text"
                placeholder="Optional Department ID"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Designation ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Designation ID</label>
            <input
              type="text"
              placeholder="Optional Designation ID"
              value={formData.designationId}
              onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

EditEmployeeModal.displayName = 'EditEmployeeModal';

export default EditEmployeeModal;