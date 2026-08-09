import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = ({ activities }) => {
  return (
    <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center justify-between">
          <span>Recent Activity</span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((act, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{act.title}</p>
                <p className="text-[10px] text-slate-400">{act.time}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {act.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;