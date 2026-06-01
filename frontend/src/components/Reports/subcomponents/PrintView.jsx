import React from "react";

const PrintView = ({ reportType, sales, customers, taxMetrics, startDate, endDate }) => {
  const sortedData = (reportType === "salesSummary" ? sales : customers)
    .slice(0, 100)
    .sort((a, b) => {
      if (reportType === "salesSummary") {
        return (parseInt(a.invoice) || 0) - (parseInt(b.invoice) || 0);
      }
      return (Number(b.total_revenue) || 0) - (Number(a.total_revenue) || 0);
    });

  return (
    <div className="hidden print-block">
      <h1 className="text-2xl font-black border-b-4 border-black pb-2 mb-2 uppercase">Official Audit Report: {reportType}</h1>
      <p className="font-black text-xs text-slate-400 mb-6 uppercase">Window: {startDate || 'INCEPTION'} TO {endDate || 'PRESENT'}</p>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Details / Entity</th>
            <th style={{textAlign: 'right'}}>Accounting Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((r, i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{r.customer} - {r.invoice ? `Bill #${r.invoice}` : `${r.total_invoices} Bills`}</td>
              <td style={{textAlign: 'right'}}>₹{Number(r.amount || r.total_revenue).toLocaleString()}</td>
            </tr>
          ))}
          <tr style={{background: '#000', color: '#fff'}}>
            <td colSpan="2" style={{fontWeight: 900}}>TOTAL AUDIT VOLUME</td>
            <td style={{textAlign: 'right', fontWeight: 900}}>₹{taxMetrics.total_amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintView;
