"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";

export default function CreateOrgModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isPending,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl p-6 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Create Organization</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Organization Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tech Innovators Ltd"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Industry & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Industry *
              </label>
              <input
                type="text"
                required
                value={formData.industry || ""}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Software Development"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Timezone *
              </label>
              <input
                type="text"
                required
                value={formData.timezone || ""}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="e.g. Asia/Dhaka"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. hr@techinnovators.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +8801700000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Website *
            </label>
            <input
              type="url"
              required
              value={formData.website || ""}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="e.g. https://techinnovators.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}