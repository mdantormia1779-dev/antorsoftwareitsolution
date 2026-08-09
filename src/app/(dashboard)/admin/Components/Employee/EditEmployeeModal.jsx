'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, X } from 'lucide-react';

const EditEmployeeModal = ({ isOpen, onClose, employee, onSave, branches = [] }) => {
  const [formData, setFormData] = useState({
    organizationId: '',
    branchId: '',
    empCode: '',
    fullName: '',
    email: '',
    phone: '',
    pin: '',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: '',
  });

  // সিলেক্ট করা এমপ্লয়ির ডাটা ফর্মে সেট করা
  useEffect(() => {
    if (employee) {
      setFormData({
        organizationId: employee.organizationId || '',
        branchId: employee.branchId || (branches.length > 0 ? (branches[0].id || branches[0]._id) : ''),
        empCode: employee.empCode || employee.employeeId || '',
        fullName: employee.fullName || employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        pin: employee.pin || '',
        role: employee.role || 'EMPLOYEE',
        department: employee.department || 'Engineering',
        designation: employee.designation || '',
      });
    }
  }, [employee, branches]);

  if (!isOpen || !employee) return null;

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    // সঠিক আইডি নিশ্চিত করা (_id অথবা id)
    const employeeIdKey = employee.id || employee._id;

    // ব্যাকএন্ডের রিকোয়ার্ড স্ট্রাকচার অনুযায়ী অবজেক্ট তৈরি
    const updatedEmployee = {
      id: employeeIdKey,
      _id: employeeIdKey,
      organizationId: formData.organizationId,
      branchId: formData.role === 'EMPLOYEE' ? formData.branchId : null,
      empCode: formData.empCode,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      pin: formData.pin,
      role: formData.role,
      department: formData.department,
      designation: formData.designation,
    };

    try {
      console.log('Saving updated employee data:', updatedEmployee);
      await onSave(updatedEmployee);
      onClose();
    } catch (error) {
      console.error('Error in onSave callback:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Pencil className="w-4 h-4 text-blue-600" />
            <h3>Edit Employee Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Phone & Employee Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Employee Code (empCode) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.empCode}
                onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* PIN & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                PIN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Organization ID & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Organization ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {formData.role === 'EMPLOYEE' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Branch ID <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
                >
                  {branches.length > 0 ? (
                    branches.map((b) => (
                      <option key={b.id || b._id} value={b.id || b._id}>
                        {b.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No branches available</option>
                  )}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Branch ID
                </label>
                <input
                  type="text"
                  readOnly
                  value="N/A (Manager/Admin)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-400 font-medium bg-slate-100 cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="HR & Operations">HR & Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Role <span className="text-rose-500">*</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;