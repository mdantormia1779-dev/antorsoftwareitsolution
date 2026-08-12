"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Clock, Calendar, ShieldCheck } from "lucide-react";
import CheckInCard from "./Components/CheckInCard";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.id || user._id;
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/employee/dashboard?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setDashboardData(data.data);
        } else {
          throw new Error(data.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome back, {dashboardData?.name || "Employee"}! 👋
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Here is your attendance overview and daily activity summary.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Duty Verified</span>
        </div>
      </div>

      {/* Check-In / Check-Out Card */}
      <CheckInCard />

      {/* Statistics & Weekly Overtime Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Weekly Overtime
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {dashboardData?.overtimeWeekly || "0h 00m"}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Today's Status
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {dashboardData?.checkOutTime
                ? "Checked Out"
                : dashboardData?.checkInTime
                ? "Working"
                : "Not Checked In"}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">
          Recent Activities
        </h3>

        {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Check-In</th>
                  <th className="py-3 px-4 font-semibold">Check-Out</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {dashboardData.recentActivities.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-700">{log.date}</td>
                    <td className="py-3.5 px-4 text-slate-600">{log.checkIn}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {log.checkOut === "Active" ? (
                        <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                          Active
                        </span>
                      ) : (
                        log.checkOut
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                        log.status === "PRESENT" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">
            No recent attendance history found.
          </p>
        )}
      </div>
    </div>
  );
}