import React from "react";
import { FileDown, Printer } from "lucide-react";

const ReportHeader = ({ onExport, onPrint }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Analytical Reports</h1>
        <p className="text-slate-500 font-medium text-sm">Financial monitoring & business growth audit</p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button 
          onClick={onExport} 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all border-2 border-slate-200 shadow-sm active:scale-95"
        >
          <FileDown size={20} /> Export
        </button>
        <button 
          onClick={onPrint} 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <Printer size={20} /> Print
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
