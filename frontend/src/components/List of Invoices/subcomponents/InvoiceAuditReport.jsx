import React from 'react';
import { colors } from '../../../theme';
import { formatINR, formatInvoiceDate } from '../invoiceListUtils';

export const InvoiceAuditReport = ({ exportData, formatDate = formatInvoiceDate }) => {
  if (!exportData?.length) return null;

  const totalRevenue = exportData.reduce((sum, i) => sum + (Number(i.grand_total) || 0), 0);
  const totalTax = exportData.reduce(
    (sum, i) => sum + (Number(i.cgst) || 0) + (Number(i.sgst) || 0) + (Number(i.igst) || 0),
    0
  );

  return (
    <div className="hidden print:block p-10 bg-white text-black min-h-screen">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoice export</h1>
          <p className="text-slate-500 text-sm mt-1">Sales transaction summary</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400 uppercase">Generated</p>
          <p className="font-semibold">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="p-3 text-left font-semibold border border-slate-200">Bill</th>
            <th className="p-3 text-left font-semibold border border-slate-200">Date</th>
            <th className="p-3 text-left font-semibold border border-slate-200">Customer</th>
            <th className="p-3 text-right font-semibold border border-slate-200">Amount</th>
            <th className="p-3 text-right font-semibold border border-slate-200">Tax</th>
            <th className="p-3 text-center font-semibold border border-slate-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {exportData.map((inv, i) => (
            <tr key={i}>
              <td className="p-3 border border-slate-100 font-medium">#{inv.bill_no}</td>
              <td className="p-3 border border-slate-100">{formatDate(inv.date)}</td>
              <td className="p-3 border border-slate-100">{inv.customer_name || inv.ship_to}</td>
              <td className="p-3 border border-slate-100 text-right font-medium">
                {formatINR(inv.grand_total)}
              </td>
              <td className="p-3 border border-slate-100 text-right text-slate-600">
                {formatINR((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0))}
              </td>
              <td className="p-3 border border-slate-100 text-center text-xs font-medium">
                {inv.invoice_status}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-900 text-white font-semibold">
            <td colSpan={3} className="p-4 text-right border border-slate-900">
              Totals ({exportData.length} invoices)
            </td>
            <td className="p-4 text-right border border-slate-900">{formatINR(totalRevenue)}</td>
            <td className="p-4 text-right border border-slate-900">{formatINR(totalTax)}</td>
            <td className="border border-slate-900" />
          </tr>
        </tfoot>
      </table>

      <style>{`
        @media print {
          th { background: ${colors.print.tableHeaderBg} !important; }
        }
      `}</style>
    </div>
  );
};
