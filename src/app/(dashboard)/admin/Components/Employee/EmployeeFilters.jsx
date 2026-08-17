'use client';

import React from 'react';
import { Search, Filter, ShieldCheck, ChevronDown } from 'lucide-react';

const EmployeeFilters = ({
  searchQuery,
  setSearchQuery,
  selectedBranch,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  branches = [], // ডাইনামিক ব্রাঞ্চ লিস্ট রিসিভ করার জন্য (ডিফল্ট খালি অ্যারে)
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or employee ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Options Container */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Branch Filter (Dynamic) */}
        <div className="relative flex-1 sm:flex-none">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
          >
            <option value="All">All Branches</option>
            {branches.map((branch, index) => {
              // ব্রাঞ্চ ডেটা অবজেক্ট বা স্ট্রিং যাই হোক না কেন তা হ্যান্ডেল করার জন্য
              const branchName = typeof branch === 'object' ? (branch.name || branch.title || branch.id) : branch;
              const branchId = typeof branch === 'object' ? (branch.id || branch._id || branch.name) : branch;

              return (
                <option key={branchId || index} value={branchName}>
                  {branchName}
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Face Status Filter */}
        <div className="relative flex-1 sm:flex-none">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
          >
            <option value="Name">Sort: Name</option>
            <option value="ID">Sort: ID</option>
            <option value="Check-In">Sort: Check-In</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;