import React from "react";
import { TrendingUp, IndianRupee, FileText, Users } from "lucide-react";

const ReportStatCard = ({ title, value, icon, color = "blue" }) => {
  const Icon = icon;
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 flex items-center transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="ml-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const ReportStats = ({ taxMetrics, customers, reportType, sales }) => {
  const activeEntities = customers.length || (reportType === "salesSummary" ? (new Set(sales.map(s => s.customer)).size || 0) : 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 no-print">
      <ReportStatCard 
        title="Total Revenue" 
        value={`₹${(taxMetrics.total_amount || 0).toLocaleString()}`} 
        icon={TrendingUp} 
        color="blue" 
      />
      <ReportStatCard 
        title="GST Liability" 
        value={`₹${(taxMetrics.total_tax || 0).toLocaleString()}`} 
        icon={IndianRupee} 
        color="emerald" 
      />
      <ReportStatCard 
        title="Total Bills" 
        value={(taxMetrics.total_invoices || 0).toString()} 
        icon={FileText} 
        color="amber" 
      />
      <ReportStatCard 
        title="Active Entities" 
        value={activeEntities.toString()} 
        icon={Users} 
        color="purple" 
      />
    </div>
  );
};

export default ReportStats;
