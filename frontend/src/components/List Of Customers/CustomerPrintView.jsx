import React from 'react';
import { colors } from '../../theme';

export default function CustomerPrintView({ customers }) {
  if (!customers?.length) return null;

  return (
    <div className="hidden print:block p-12 bg-white text-black min-h-screen">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer directory</h1>
          <p className="text-slate-500 text-sm mt-1">Official customer record index</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400 uppercase">Export date</p>
          <p className="font-semibold text-slate-900">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="p-3 text-left font-semibold border border-slate-200">Customer</th>
            <th className="p-3 text-left font-semibold border border-slate-200">Phone</th>
            <th className="p-3 text-left font-semibold border border-slate-200">Address</th>
            <th className="p-3 text-center font-semibold border border-slate-200">GSTIN</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id}>
              <td className="p-3 border border-slate-100 font-medium">{c.name}</td>
              <td className="p-3 border border-slate-100">{c.phone_number || '—'}</td>
              <td className="p-3 border border-slate-100 text-slate-600">
                {[c.address_line1, c.address_line2].filter(Boolean).join(', ') || '—'}
              </td>
              <td className="p-3 border border-slate-100 text-center text-xs font-medium">
                {c.gstin || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-slate-400 mt-8">{customers.length} customers listed</p>

      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          th { background: ${colors.print.tableHeaderBg} !important; }
        }
      `}</style>
    </div>
  );
}
