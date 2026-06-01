import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { getRecentInvoices } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import ChartCard from './ChartCard';
import { formatINR, formatRelativeDate } from './dashboardUtils';

const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Overdue: 'bg-red-50 text-red-700 ring-red-600/20',
  Due: 'bg-amber-50 text-amber-800 ring-amber-600/20',
};

const RecentInvoices = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await getRecentInvoices(5, startDate, endDate);
        setInvoices(res.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [startDate, endDate]);

  return (
    <ChartCard
      title="Recent invoices"
      subtitle={`Latest in ${label}`}
      loading={loading}
      action={
        <Link to="/invoices" className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-0.5">
          View all <ChevronRight size={14} />
        </Link>
      }
      bodyClassName="min-h-0 !min-h-[auto]"
    >
      {error && <p className="text-red-500 text-sm py-4">{error}</p>}

      {!error && invoices.length === 0 && (
        <div className="py-10 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No invoices yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-4">Create your first invoice to see activity here.</p>
          <Link to="/invoice-form" className="btn-cta-primary !text-sm !py-2">
            Create invoice
          </Link>
        </div>
      )}

      {!error && invoices.length > 0 && (
        <ul className="divide-y divide-slate-100 -mx-1">
          {invoices.map((invoice) => (
            <li key={invoice.invoice_id}>
              <Link
                to={`/invoice/${invoice.invoice_id}`}
                className="flex items-center justify-between gap-3 py-3.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate group-hover:text-brand-primary transition-colors">
                    {invoice.customer_name || 'Walk-in customer'}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Bill #{invoice.bill_no} · {formatINR(invoice.grand_total)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ring-1 ring-inset ${
                      statusStyles[invoice.invoice_status] || statusStyles.Due
                    }`}
                  >
                    {invoice.invoice_status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatRelativeDate(invoice.date)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
};

export default RecentInvoices;
