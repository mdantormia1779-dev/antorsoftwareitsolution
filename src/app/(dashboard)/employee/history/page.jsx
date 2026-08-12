"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, History, ArrowRight } from 'lucide-react';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem('user'); 
        let userId = '';

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id || parsedUser.userId || storedUser;
          } catch {
            userId = storedUser;
          }
        }

        if (!userId) {
          throw new Error('User ID not found in localStorage. Please login first.');
        }

        const response = await fetch(`/api/attendance-history/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <History className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Attendance Logs</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Attendance History
            </h1>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto">
            Total Records: <span className="text-blue-600 font-bold">{historyData.length}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 font-medium text-sm">Loading your history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* History Cards List */}
        {!loading && !error && (
          <div className="space-y-3">
            {historyData.length > 0 ? (
              historyData.map((item) => {
                const isOnTime = item.status === 'On time' || item.status === 'PRESENT';
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                  >
                    {/* Left Side: Date and Time Info */}
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isOnTime ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {isOnTime ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {item.date}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium flex-wrap">
                          <span className="flex items-center gap-1 text-slate-600 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.time}
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">
                            {item.duration || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Status Badge */}
                    <div className="flex items-center justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                          isOnTime
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnTime ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-700">No history found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  You haven't checked in yet or there are no past records available to show.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;