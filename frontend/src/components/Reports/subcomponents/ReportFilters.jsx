import React from "react";
import { Filter } from "lucide-react";

const ReportFilters = ({ 
  reportType, 
  setReportType, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onRunAnalysis, 
  loading 
}) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-4 items-end gap-6 no-print">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Category</label>
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)} 
          className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 font-bold focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="salesSummary">Revenue Summary</option>
          <option value="customerReport">Customer Rankings</option>
          <option value="taxReport">GST & Compliance</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">From</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 font-bold focus:border-blue-500 transition-all" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Until</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 font-bold focus:border-blue-500 transition-all" 
        />
      </div>
      <button 
        onClick={onRunAnalysis} 
        disabled={loading} 
        className="w-full py-4.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 h-[54px]"
      >
        <Filter size={18} /> {loading ? "ANALYZING..." : "RUN ANALYSIS"}
      </button>
    </div>
  );
};

export default ReportFilters;
