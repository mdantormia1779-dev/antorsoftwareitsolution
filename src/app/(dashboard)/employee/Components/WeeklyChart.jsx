import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeeklyChart = ({ data }) => {
  return (
    <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          THIS WEEK ACTIVITY
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-end justify-between px-2 sm:px-6 h-48">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-3 h-full justify-end group">
              <div className="w-3 sm:w-4 bg-slate-100 rounded-full h-36 flex items-end overflow-hidden p-0.5">
                <div 
                  className="w-full bg-blue-600 rounded-full group-hover:bg-blue-700 transition-all duration-300"
                  style={{ height: item.percent }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-700">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;