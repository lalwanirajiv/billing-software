import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getTopSellingItems } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import { chartPaletteItems, chartAxis, rechartsTooltipProps } from '../../theme';
import ChartCard from './ChartCard';
import { formatINR } from './dashboardUtils';

const TopItemsChart = () => {
  const { startDate, endDate, label } = useFinancialYear();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTopSellingItems(5, startDate, endDate);
        setData(res.data || []);
      } catch (err) {
        console.error('Error fetching top items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <ChartCard
      title="Top selling items"
      subtitle={`In ${label}`}
      loading={loading}
    >
      {data.length === 0 && !loading ? (
        <p className="text-slate-400 text-sm text-center py-16">No item sales data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 24, left: 8, bottom: 5 }}
            barSize={18}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke={chartAxis.gridStroke} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: chartAxis.tickFill, fontSize: 11 }}
              width={96}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              {...rechartsTooltipProps}
              formatter={(value) => [formatINR(value), 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[0, 6, 6, 0]} animationDuration={1200}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={chartPaletteItems[index % chartPaletteItems.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default TopItemsChart;
