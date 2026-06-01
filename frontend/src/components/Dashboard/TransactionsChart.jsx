import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getRevenueTimeline } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import {
  colors,
  chartAxis,
  chartInteraction,
  rechartsTooltipProps,
} from '../../theme';
import ChartCard from './ChartCard';

const TransactionsChart = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getRevenueTimeline(startDate, endDate);
        const formattedData = (res.data || []).map((item) => {
          let name = 'Unknown';
          if (item.month && item.month !== 'Unknown') {
            try {
              name = new Date(`${item.month}-01`).toLocaleString('default', { month: 'short' });
            } catch {
              name = item.month;
            }
          }
          return { ...item, name };
        });
        setData(formattedData);
        setTotalCount(formattedData.reduce((s, row) => s + (row.count || 0), 0));
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [startDate, endDate]);

  return (
    <ChartCard
      title="Monthly invoice volume"
      subtitle={`${label} · ${totalCount} invoices`}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
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
            allowDecimals={false}
          />
          <Tooltip
            {...rechartsTooltipProps}
            cursor={{ fill: chartInteraction.primaryCursor }}
          />
          <Bar
            dataKey="count"
            fill={colors.primary}
            radius={[6, 6, 0, 0]}
            barSize={28}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default TransactionsChart;
