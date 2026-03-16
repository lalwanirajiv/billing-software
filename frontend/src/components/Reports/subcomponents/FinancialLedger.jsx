import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FinancialLedger = ({ 
  reportType, 
  sales, 
  customers, 
  taxMetrics, 
  rowsPerPage, 
  setRowsPerPage, 
  currentPage, 
  setCurrentPage, 
  loading 
}) => {
  const data = reportType === "salesSummary" ? sales : (reportType === "customerReport" ? customers : []);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-20 no-print">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Financial Ledger</h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase text-slate-400">Rows:</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
            className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
            {reportType === "salesSummary" ? (
              <tr>
                <th className="px-8 py-5">S.No.</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Bill No.</th>
                <th className="px-8 py-5">Bill Date</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            ) : reportType === "customerReport" ? (
              <tr>
                <th className="px-8 py-5">S.No.</th>
                <th className="px-8 py-5">Customer Entity</th>
                <th className="px-8 py-5 text-right">Transaction Volume</th>
                <th className="px-8 py-5 text-right">Total Revenue (₹)</th>
              </tr>
            ) : (
              <tr>
                <th className="px-8 py-5">Accounting Metric</th>
                <th className="px-8 py-5 text-right">Financial Value (₹)</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-600">
            {reportType === "salesSummary" && currentData.map((r, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-8 py-5 text-slate-400">{(currentPage-1)*rowsPerPage + i + 1}</td>
                <td className="px-8 py-5 text-slate-900 font-black">{r.customer}</td>
                <td className="px-8 py-5">#{r.invoice}</td>
                <td className="px-8 py-5">{formatDate(r.date)}</td>
                <td className="px-8 py-5 text-slate-900 font-black text-lg">₹{Number(r.amount).toLocaleString()}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.invoice_status?.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    {r.invoice_status || 'DUE'}
                  </span>
                </td>
              </tr>
            ))}
            {reportType === "customerReport" && currentData.map((r, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-8 py-5 text-slate-400">{(currentPage-1)*rowsPerPage + i + 1}</td>
                <td className="px-8 py-5 text-slate-900 font-black">{r.customer}</td>
                <td className="px-8 py-5 text-right">{r.total_invoices} Invoices</td>
                <td className="px-8 py-5 text-right text-slate-900 font-black text-lg">₹{Number(r.total_revenue).toLocaleString()}</td>
              </tr>
            ))}
            {reportType === "taxReport" && (
               <>
                <tr><td className="px-10 py-5 font-black text-slate-800">Net Taxable Revenue</td><td className="px-10 py-5 text-right font-black text-slate-900">₹{(taxMetrics.taxable_value || 0).toLocaleString()}</td></tr>
                <tr className="bg-blue-600 text-white"><td className="px-10 py-8 text-xl font-black uppercase">Gross Statutory Tax</td><td className="px-10 py-8 text-right text-3xl font-black">₹{(taxMetrics.total_tax || 0).toLocaleString()}</td></tr>
               </>
            )}
            {currentData.length === 0 && !loading && (
              <tr><td colSpan="6" className="px-10 py-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No analysis results found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <span className="text-xs font-black text-slate-400">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
              disabled={currentPage === 1} 
              className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
              disabled={currentPage === totalPages} 
              className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialLedger;
