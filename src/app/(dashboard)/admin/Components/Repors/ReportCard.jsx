'use client';

import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

const ReportCard = ({ icon: Icon, title, description, onExportPDF, onExportExcel }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6">
      
      {/* Upper Info Box */}
      <div className="space-y-3">
        {/* Purple Icon Container */}
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onExportPDF}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>PDF</span>
        </button>

        <button
          onClick={onExportExcel}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Excel</span>
        </button>
      </div>

    </div>
  );
};

export default ReportCard;