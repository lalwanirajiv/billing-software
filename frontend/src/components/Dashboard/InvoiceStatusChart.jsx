import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoiceStatusCounts } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { invoiceStatusChartColors, rechartsTooltipProps } from '../../theme';
import ChartCard from './ChartCard';

const InvoiceStatusChart = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      try {
        const res = await getInvoiceStatusCounts(startDate, endDate);
        setData(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceStatus();
  }, [startDate, endDate]);

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  const emptyBody = error ? (
    <p className="text-red-500 text-sm text-center py-16">{error}</p>
  ) : !total ? (
    <p className="text-slate-400 text-sm text-center py-16">No invoices yet</p>
  ) : null;

  return (
    <ChartCard
      title="Invoice status"
      subtitle={`In ${label}`}
      loading={loading}
      action={
        <Link to="/invoices" className="text-xs font-semibold text-brand-primary hover:underline">
          View all
        </Link>
      }
    >
      {emptyBody || (
        <div className="flex flex-col h-full">
          <div className="relative h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={invoiceStatusChartColors[index % invoiceStatusChartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip {...rechartsTooltipProps} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center -mt-2">
                <p className="text-2xl font-bold text-slate-900">{total}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Invoices
                </p>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-3 gap-2 px-2 mt-2">
            {data.map((item, index) => (
              <li key={item.name} className="text-center p-2 rounded-lg bg-slate-50">
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-1"
                  style={{
                    backgroundColor:
                      invoiceStatusChartColors[index % invoiceStatusChartColors.length],
                  }}
                />
                <p className="text-[10px] font-semibold text-slate-500 uppercase">{item.name}</p>
                <p className="text-sm font-bold text-slate-900">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
};

export default InvoiceStatusChart;
