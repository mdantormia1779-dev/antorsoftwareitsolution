import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, iconColor = "text-blue-500" }) => {
  return (
    <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        {/* আইকনটি উপরে বাম পাশে */}
        {Icon && (
          <div className="mb-3">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        
        {/* ভ্যালু এবং টাইটেল */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;