import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { getRevenueTimeline } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import {
  colors,
  chartAxis,
  chartInteraction,
  rechartsTooltipProps,
} from '../../theme';
import ChartCard from './ChartCard';
import { formatINR } from './dashboardUtils';

const RevenueChart = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fyTotal, setFyTotal] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await getRevenueTimeline(startDate, endDate);
        const chartData = (res.data || []).map((item) => ({
          name: new Date(`${item.month}-01`).toLocaleString('default', { month: 'short' }),
          revenue: item.revenue,
        }));
        setMonthlyRevenueData(chartData);
        setFyTotal((res.data || []).reduce((sum, row) => sum + (row.revenue || 0), 0));
      } catch (err) {
        console.error('Error fetching revenue timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [startDate, endDate]);

  return (
    <ChartCard
      title="Revenue trend"
      subtitle={`${label} · ${formatINR(fyTotal)} total`}
      loading={loading}
      action={
        <Link
          to="/reports"
          className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
        >
          Full reports
        </Link>
      }
      bodyClassName="min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={monthlyRevenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartAxis.gridStroke} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartAxis.tickFill, fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartAxis.tickFill, fontSize: 11 }}
            tickFormatter={(v) =>
              v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
            }
            width={52}
          />
          <Tooltip
            {...rechartsTooltipProps}
            formatter={(value) => [formatINR(value), 'Revenue']}
            cursor={{ fill: chartInteraction.primaryCursorSubtle }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={colors.primary}
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            activeDot={{ r: 5, strokeWidth: 0, fill: colors.primary }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RevenueChart;
