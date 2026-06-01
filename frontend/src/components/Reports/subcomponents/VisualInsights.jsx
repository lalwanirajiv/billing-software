import React from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import ChartCard from '../../Dashboard/ChartCard';
import {
  chartPalette,
  chartPaletteItems,
  statusColors,
  palette,
  colors,
  chartAxis,
  chartInteraction,
  rechartsTooltipProps,
} from '../../../theme';
import { formatINR } from '../reportsUtils';

const STATUS_ORDER = ['Paid', 'Due', 'Overdue'];

const chartTitles = {
  salesSummary: { title: 'Revenue trend', subtitle: 'Monthly sales in selected period' },
  customerReport: { title: 'Top customers', subtitle: 'Revenue by customer (top 10)' },
  taxReport: { title: 'Tax composition', subtitle: 'CGST · SGST · IGST split' },
};

const VisualInsights = ({ reportType, chart, statusBreakdown, loading }) => {
  const mainMeta = chartTitles[reportType] || chartTitles.salesSummary;
  const statusTotal = statusBreakdown.reduce((s, row) => s + (Number(row.count) || 0), 0);
  const hasMainChart = chart && chart.length > 0;

  const mainChart = (
    <ChartCard title={mainMeta.title} subtitle={mainMeta.subtitle} loading={loading} bodyClassName="min-h-[320px]">
      {!hasMainChart && !loading ? (
        <p className="text-slate-400 text-sm text-center py-20">No chart data for this period</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {reportType === 'salesSummary' ? (
            <AreaChart data={chart} margin={{ bottom: 20, left: 0, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="reportRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartAxis.gridStroke} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartAxis.tickFillReports, fontSize: 10 }}
                angle={chart.length > 6 ? -35 : 0}
                textAnchor={chart.length > 6 ? 'end' : 'middle'}
                height={chart.length > 6 ? 56 : 30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartAxis.tickFillReports, fontSize: 10 }}
                tickFormatter={(v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
                width={48}
              />
              <Tooltip
                {...rechartsTooltipProps}
                formatter={(value) => [formatINR(value), 'Revenue']}
                cursor={{ fill: chartInteraction.primaryCursorSubtle }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={colors.primary}
                strokeWidth={2}
                fill="url(#reportRevenueGradient)"
              />
            </AreaChart>
          ) : reportType === 'customerReport' ? (
            <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke={chartAxis.gridStroke} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={108}
                tick={{ fill: chartAxis.tickFillReports, fontSize: 10 }}
              />
              <Tooltip
                {...rechartsTooltipProps}
                cursor={{ fill: 'transparent' }}
                formatter={(value) => [formatINR(value), 'Revenue']}
              />
              <Bar dataKey="sales" radius={[0, 6, 6, 0]} barSize={20}>
                {chart.map((e, i) => (
                  <Cell key={`c-${i}`} fill={chartPaletteItems[i % chartPaletteItems.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chart}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chart.map((e, i) => (
                  <Cell key={`p-${i}`} fill={chartPalette[i % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip {...rechartsTooltipProps} formatter={(value) => [formatINR(value), 'Amount']} />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </ChartCard>
  );

  const statusPanel = (
    <ChartCard
      title="Payment status"
      subtitle="Invoice count & value by status"
      loading={loading}
      bodyClassName="min-h-[320px]"
    >
      <div className="relative h-[180px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
              dataKey="count"
              nameKey="status"
              stroke="none"
            >
              {statusBreakdown.map((entry, index) => (
                <Cell
                  key={`status-${entry.status}`}
                  fill={statusColors[entry.status] || palette.slate[300]}
                />
              ))}
            </Pie>
            <Tooltip {...rechartsTooltipProps} />
          </PieChart>
        </ResponsiveContainer>
        {statusTotal > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">{statusTotal}</p>
              <p className="text-[10px] uppercase text-slate-400 font-semibold">Invoices</p>
            </div>
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {STATUS_ORDER.map((status) => {
          const row = statusBreakdown.find((s) => s.status === status) || { count: 0, amount: 0 };
          const color = statusColors[status];
          return (
            <li
              key={status}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{status}</p>
                  <p className="text-[11px] text-slate-400">{row.count} invoices</p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-900">{formatINR(row.amount)}</p>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );

  return (
    <div
      className={`grid grid-cols-1 gap-6 mb-6 no-print ${
        reportType === 'taxReport' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
      }`}
    >
      <div className={reportType === 'taxReport' ? 'min-h-[380px]' : 'lg:col-span-2 min-h-[380px]'}>
        {mainChart}
      </div>
      <div>{statusPanel}</div>
    </div>
  );
};

export default VisualInsights;
