'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, ShieldCheck, ArrowUpDown, Check } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Branch');

  // Dropdown Open/Close States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // ডামি ডাটা
  const employeesData = [
    {
      id: 'EMP-2098',
      name: 'Isla Fontaine',
      initials: 'IF',
      avatarBg: 'bg-emerald-600',
      branch: 'Westline Hub',
      status: 'Inactive',
      faceStatus: 'Verified',
      checkIn: '—',
      checkInSubText: null,
      hours: '0h 00m'
    },
    {
      id: 'EMP-2054',
      name: 'Owen Marsh',
      initials: 'OM',
      avatarBg: 'bg-rose-600',
      branch: 'Eastline Hub',
      status: 'Active',
      faceStatus: 'Failed',
      checkIn: '—',
      checkInSubText: 'Late',
      hours: '0h 00m'
    },
    {
      id: 'EMP-2011',
      name: 'Priya Nair',
      initials: 'PN',
      avatarBg: 'bg-emerald-600',
      branch: 'Central Hub',
      status: 'Active',
      faceStatus: 'Verified',
      checkIn: '08:15',
      checkInSubText: null,
      hours: '9h 17m'
    }
  ];

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করার ফিল্টার
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ১. Search & Status Filter Logic
  const filteredEmployees = employeesData.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      emp.status === statusFilter ||
      emp.faceStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ২. Sorting Logic (Name, Branch, Hours)
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'Branch') {
      return a.branch.localeCompare(b.branch);
    }
    if (sortBy === 'Hours') {
      const parseHoursToMinutes = (timeStr) => {
        const match = timeStr.match(/(\d+)h\s*(\d+)m/);
        if (!match) return 0;
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      };
      return parseHoursToMinutes(b.hours) - parseHoursToMinutes(a.hours);
    }
    return 0;
  });

  const filterOptions = ['All', 'Active', 'Inactive'];
  const sortOptions = ['Branch', 'Name', 'Hours'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          {sortedEmployees.length} OF {employeesData.length} SHOWN
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-0.5">
          Employees
        </h1>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-xs space-y-6">
        
        {/* Top Controls: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            
            {/* Custom Status Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                type="button"
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsSortOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-all cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>{statusFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Menu Popup */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-50 transition-all">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Status Filter
                  </div>
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        statusFilter === option 
                          ? 'bg-blue-50/60 text-blue-600 font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{option}</span>
                      {statusFilter === option && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button 
                type="button"
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-all cursor-pointer shadow-2xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort: {sortBy}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Menu Popup */}
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-50 transition-all">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sort By
                  </div>
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        sortBy === option 
                          ? 'bg-blue-50/60 text-blue-600 font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{option}</span>
                      {sortBy === option && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">Employee</th>
                <th className="py-3 px-2">Branch</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Face Status</th>
                <th className="py-3 px-2">Check-In</th>
                <th className="py-3 px-2">Hours</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs sm:text-sm">
              {sortedEmployees.length > 0 ? (
                sortedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* Employee Name & ID */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <Avatar className={`h-9 w-9 ${emp.avatarBg} text-white font-semibold shrink-0`}>
                          <AvatarFallback className={`${emp.avatarBg} text-white text-xs`}>
                            {emp.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">
                            {emp.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {emp.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-4 px-2 text-slate-600 font-medium">
                      {emp.branch}
                    </td>

                    {/* Employee Status (Active/Inactive) */}
                    <td className="py-4 px-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Face Verification Status */}
                    <td className="py-4 px-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.faceStatus === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-500'
                      }`}>
                        {emp.faceStatus}
                      </span>
                    </td>

                    {/* Check-In Time & Badge */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">
                          {emp.checkIn}
                        </span>
                        {emp.checkInSubText && (
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                            {emp.checkInSubText}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="py-4 px-2 text-slate-600 font-medium">
                      {emp.hours}
                    </td>

                    {/* Action Arrow */}
                    <td className="py-4 px-2 text-right">
                      <button className="p-1 text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-xs">
                    No employees found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 font-medium">
          <span>Page 1 of 1</span>
          
          <div className="flex items-center gap-1">
            <button disabled className="p-1.5 rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled className="p-1.5 rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EmployeesPage;