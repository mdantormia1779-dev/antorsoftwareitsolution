'use client';

import React from 'react';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

const priorityBadges = {
  High: 'bg-rose-100/80 text-rose-500',
  Medium: 'bg-amber-100/80 text-amber-600',
  Low: 'bg-sky-100/80 text-sky-500',
};

const NotificationItem = ({ item, onEdit, onDelete }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all flex flex-col sm:flex-row justify-between gap-4 ${
        item.isUnread
          ? 'border-blue-200/80 shadow-2xs'
          : 'border-slate-100/80 shadow-2xs'
      }`}
    >
      <div className="flex gap-3.5 items-start">
        {/* Unread Indicator Dot */}
        {item.isUnread ? (
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
        ) : (
          <div className="w-2.5 shrink-0" />
        )}

        <div className="space-y-1.5">
          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
            {item.message}
          </p>

          {/* Image Attached Tag (If available) */}
          {item.hasImage && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pt-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image attached</span>
            </div>
          )}

          {/* Meta Info */}
          <p className="text-xs font-semibold text-slate-400 pt-1">
            {item.branch} · {item.time}
          </p>
        </div>
      </div>

      {/* Right Side: Badge & Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 shrink-0">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            priorityBadges[item.priority] || priorityBadges.Low
          }`}
        >
          {item.priority}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;