'use client';

import React, { useState, useEffect } from 'react';

const AnnouncementModal = ({ isOpen, onClose, onSubmit, initialData, organizationId, currentUserId }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [branchId, setBranchId] = useState('');
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // মডাল ওপেন হলে অথবা initialData বা organizationId পরিবর্তন হলে ফিল্ডগুলো আপডেট হবে
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setMessage(initialData.message || '');
      setPriority(initialData.priority ? initialData.priority.toUpperCase() : 'MEDIUM');
      setBranchId(initialData.branchId || '');
    } else {
      setTitle('');
      setMessage('');
      setPriority('MEDIUM');
      setBranchId('');
    }
  }, [initialData, isOpen]);

  // সিলেক্ট করা অর্গানাইজেশনের ব্রাঞ্চগুলো ফেচ করা
  useEffect(() => {
    if (isOpen && organizationId) {
      setLoadingBranches(true);
      fetch(`/api/branches?organizationId=${organizationId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBranches(data.data);
          } else {
            setBranches([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching branches:', err);
          setBranches([]);
        })
        .finally(() => setLoadingBranches(false));
    }
  }, [isOpen, organizationId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message fields.');
      return;
    }

    onSubmit({
      title,
      message,
      priority,
      branchId: branchId === '' ? null : branchId, // ফাঁকা থাকলে null (সব ব্রাঞ্চের জন্য)
      organizationId,
      createdById: currentUserId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Announcement' : 'Create New Announcement'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-150 transition-colors text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Office Holiday Notice"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50/50"
            />
          </div>

          {/* Branch Target Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Target Branch</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50/50 cursor-pointer"
            >
              <option value="">All Branches (Global Announcement)</option>
              {loadingBranches ? (
                <option disabled>Loading branches...</option>
              ) : (
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Priority Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50/50 cursor-pointer"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Message / Body Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Message *</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your announcement details here..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 shadow-sm transition-colors cursor-pointer"
            >
              {initialData ? 'Update Announcement' : 'Post Announcement'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AnnouncementModal;