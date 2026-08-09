import React from 'react';

// মক ডাটা অ্যারেই (Mock Data)
const historyData = [
  {
    id: 1,
    date: 'Aug 06, 2026',
    time: '08:50 → 18:00',
    duration: '9h 00m',
    status: 'On time',
  },
  {
    id: 2,
    date: 'Aug 05, 2026',
    time: '08:51 → 18:01',
    duration: '9h 01m',
    status: 'Late',
  },
  {
    id: 3,
    date: 'Aug 04, 2026',
    time: '08:52 → 18:02',
    duration: '9h 02m',
    status: 'On time',
  },
  {
    id: 4,
    date: 'Aug 03, 2026',
    time: '08:53 → 18:03',
    duration: '9h 03m',
    status: 'On time',
  },
  {
    id: 5,
    date: 'Aug 01, 2026',
    time: '08:54 → 18:04',
    duration: '9h 04m',
    status: 'On time',
  },
];

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
          History
        </h1>

        {/* History Cards List */}
        <div className="space-y-3.5">
          {historyData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all duration-200"
            >
              {/* Left Side: Date and Time Info */}
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                  {item.date}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {item.time} · {item.duration}
                </p>
              </div>

              {/* Right Side: Status Badge */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                    item.status === 'On time'
                      ? 'bg-emerald-100/80 text-emerald-700'
                      : 'bg-amber-100/80 text-amber-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;