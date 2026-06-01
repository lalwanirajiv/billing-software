import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import { getTopCustomers } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import ChartCard from './ChartCard';
import { formatINR } from './dashboardUtils';

const rankStyles = [
  'bg-indigo-600 text-white',
  'bg-indigo-100 text-indigo-700',
  'bg-slate-200 text-slate-700',
];

const TopCustomers = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxRevenue, setMaxRevenue] = useState(0);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const res = await getTopCustomers(5, startDate, endDate);
        const list = res.data || [];
        setTopCustomers(list);
        setMaxRevenue(Math.max(...list.map((c) => Number(c.total_revenue) || 0), 1));
      } catch (err) {
        setError(err.message || 'Failed to fetch top customers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopCustomers();
  }, [startDate, endDate]);

  return (
    <ChartCard
      title="Top customers"
      subtitle={`By revenue in ${label}`}
      loading={loading}
      action={
        <Link to="/customers" className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-0.5">
          View all <ChevronRight size={14} />
        </Link>
      }
      bodyClassName="min-h-0 !min-h-[auto]"
    >
      {error && <p className="text-red-500 text-sm py-4">{error}</p>}

      {!error && topCustomers.length === 0 && (
        <div className="py-10 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No customer revenue yet</p>
          <Link to="/create-customer" className="text-sm text-brand-primary font-semibold mt-2 inline-block hover:underline">
            Add a customer
          </Link>
        </div>
      )}

      {!error && topCustomers.length > 0 && (
        <ul className="space-y-4">
          {topCustomers.map((customer, index) => {
            const revenue = Number(customer.total_revenue) || 0;
            const pct = Math.round((revenue / maxRevenue) * 100);
            const rankClass = rankStyles[index] || 'bg-slate-100 text-slate-600';

            return (
              <li key={customer.customer_id || index}>
                <div className="flex items-center gap-3 mb-1.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${rankClass}`}
                  >
                    {index + 1}
                  </span>
                  <p className="font-medium text-slate-900 truncate flex-1">
                    {customer.customer_name}
                  </p>
                  <p className="text-sm font-bold text-slate-700 shrink-0">{formatINR(revenue)}</p>
                </div>
                <div className="ml-10 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
};

export default TopCustomers;
