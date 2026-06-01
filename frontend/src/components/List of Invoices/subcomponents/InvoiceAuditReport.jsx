import React from "react";

export const InvoiceAuditReport = ({ exportData, formatDate }) => {
  if (exportData.length === 0) return null;

  return (
    <div className="hidden print:block p-12 bg-white text-black min-h-screen">
      <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-8 mb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Sales Audit</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Transaction Summary Report</p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-black text-xs uppercase text-slate-400">Generation Date</p>
          <p className="font-black text-xl">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-y-2 border-slate-900">
            <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Bill No</th>
            <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Date</th>
            <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Customer Entity</th>
            <th className="p-4 text-right font-black uppercase text-[10px] tracking-widest border border-slate-200">Revenue (₹)</th>
            <th className="p-4 text-right font-black uppercase text-[10px] tracking-widest border border-slate-200">GST Breakdown</th>
            <th className="p-4 text-center font-black uppercase text-[10px] tracking-widest border border-slate-200">Audit Status</th>
          </tr>
        </thead>
        <tbody>
          {exportData.map((inv, i) => (
            <tr key={i} className="border-b border-slate-100 italic-last-row">
              <td className="p-4 border border-slate-100 font-black text-lg">#{inv.bill_no}</td>
              <td className="p-4 border border-slate-100 text-sm font-bold text-slate-600 whitespace-nowrap">{formatDate(inv.date)}</td>
              <td className="p-4 border border-slate-100 text-sm font-black text-slate-900 uppercase">{inv.customer_name || inv.ship_to}</td>
              <td className="p-4 border border-slate-100 text-right font-black text-lg text-slate-900">₹{inv.grand_total?.toLocaleString()}</td>
              <td className="p-4 border border-slate-100 text-right text-xs font-bold text-slate-400">₹{(inv.cgst + inv.sgst + inv.igst)?.toLocaleString()}</td>
              <td className="p-4 border border-slate-100 text-center uppercase text-[10px] font-black">
                <span className="bg-slate-100 px-3 py-1 rounded-full">{inv.invoice_status}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-900 text-white font-black border-t-4 border-white">
            <td colSpan="3" className="p-6 text-right text-xs uppercase tracking-[0.3em]">Total Audit Volume</td>
            <td className="p-6 text-right text-3xl font-black">₹{exportData.reduce((sum, i) => sum + (i.grand_total || 0), 0).toLocaleString()}</td>
            <td className="p-6 text-right text-sm">₹{exportData.reduce((sum, i) => sum + ((i.cgst || 0) + (i.sgst || 0) + (i.igst || 0)), 0).toLocaleString()}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-12 flex justify-between items-center px-4">
         <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-300">Authentication Signature</p>
            <div className="w-48 h-px bg-slate-200 mt-8"></div>
         </div>
         <p className="text-[10px] text-slate-300 italic uppercase tracking-[0.5em]">Digitally Generated Ledger</p>
      </div>
    </div>
  );
};
