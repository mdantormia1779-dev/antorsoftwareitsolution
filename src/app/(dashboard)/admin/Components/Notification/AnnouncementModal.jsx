'use client';

import React, { useState, useEffect } from 'react';
import { Send, X, Image as ImageIcon } from 'lucide-react';

const AnnouncementModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    branch: 'All branches',
    priority: 'Low',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        message: initialData.message || '',
        branch: initialData.branch || 'All branches',
        priority: initialData.priority || 'Low',
      });
    } else {
      setFormData({
        title: '',
        message: '',
        branch: 'All branches',
        priority: 'Low',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            <Send className="w-4 h-4" />
            <span>{initialData ? 'Edit Announcement' : 'New Announcement'}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-600 font-semibold">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Branch A will have 20% discount campaign today"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-slate-800 transition-colors"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-600 font-semibold">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Write your announcement..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-slate-800 transition-colors resize-none"
            />
          </div>

          {/* Send To & Priority Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-600 font-semibold">
                Send to
              </label>
              <select
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-slate-800 bg-white"
              >
                <option value="All branches">All branches</option>
                <option value="Westline Hub">Westline Hub</option>
                <option value="Harbor Point">Harbor Point</option>
                <option value="Meridian HQ">Meridian HQ</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-600 font-semibold">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-slate-800 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50/50 transition-colors flex items-center justify-center gap-2 text-slate-400">
            <ImageIcon className="w-4 h-4" />
            <span>Attach image (optional)</span>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{initialData ? 'Save Changes' : 'Send Announcement'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AnnouncementModal;