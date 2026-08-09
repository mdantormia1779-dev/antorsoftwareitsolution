'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeCreated, branches = [], organizations = [], defaultOrgId = '' }) => {
  const generateUniqueEmpId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    pin: '',
    organizationId: '',
    branchId: '',
    systemRole: 'EMPLOYEE',
    designation: 'Frontend Developer',
    department: 'Engineering',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        employeeId: generateUniqueEmpId(),
        pin: '',
        organizationId: defaultOrgId || (organizations.length > 0 ? organizations[0].id : ''),
        branchId: branches.length > 0 ? branches[0].id : '',
        systemRole: 'EMPLOYEE',
        designation: 'Frontend Developer',
        department: 'Engineering',
      });
      setErrorMsg('');
    }
  }, [isOpen, defaultOrgId, organizations, branches, generateUniqueEmpId]);

  if (!isOpen) return null;

  const designationOptions = {
    MANAGER: [
      'Engineering Manager',
      'HR Manager',
      'Project Manager',
      'Product Manager',
    ],
    EMPLOYEE: [
      'Frontend Developer',
      'Backend Developer',
      'Fullstack Developer',
      'UI/UX Designer',
      'QA Engineer',
    ],
    ADMIN: ['System Administrator', 'Operations Head'],
  };

  const handleSystemRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({
      ...prev,
      systemRole: selectedRole,
      designation: designationOptions[selectedRole]?.[0] || 'Employee',
      branchId: (selectedRole === 'EMPLOYEE' || selectedRole === 'MANAGER') && branches.length > 0 ? branches[0].id : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const resolvedBranchId = 
      (formData.systemRole === 'EMPLOYEE' || formData.systemRole === 'MANAGER') && formData.branchId !== '' 
        ? formData.branchId 
        : null;

    const payload = {
      organizationId: formData.organizationId,
      branchId: resolvedBranchId,
      empCode: formData.employeeId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      pin: formData.pin,
      role: formData.systemRole,
      department: formData.department,
      designation: formData.designation,
    };

    try {
      // সরাসরি আপনার ব্যাকএন্ড API বা প্যারেন্ট ফাংশনে ডাটা পাঠানো হচ্ছে
      await onEmployeeCreated(payload);
    } catch (err) {
      console.error('Submit Error:', err);
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Plus className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            <h3>Add Employee</h3>
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
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

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
                  <option key={org.id} value={org.id}>
                    {org.name || org.title || org.id}
                  </option>
                ))
              ) : (
                <option value="">No organizations available</option>
              )}
            </select>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Employee Code (EMP ID) *</label>
              <input
                type="text"
                readOnly
                value={formData.employeeId}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-500 font-semibold bg-slate-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* PIN & Access Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">PIN *</label>
              <input
                type="password"
                required
                placeholder="1234"
                maxLength={6}
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Access Role *</label>
              <select
                value={formData.systemRole}
                onChange={handleSystemRoleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* Assigned Branch & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.systemRole === 'EMPLOYEE' || formData.systemRole === 'MANAGER' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Branch</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer"
                >
                  {branches.length > 0 ? (
                    branches.map((b) => (
                      <option key={b.id} value={b.id}>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Branch</label>
                <input
                  type="text"
                  readOnly
                  value="N/A (Admin)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-400 font-medium bg-slate-100 cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Designation *</label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50/50 cursor-pointer"
            >
              {designationOptions[formData.systemRole]?.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
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
                'Create Employee'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;