import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];
const STATUS_COLORS = { 'Paid': '#10b981', 'Due': '#f59e0b', 'Overdue': '#ef4444' };

const VisualInsights = ({ reportType, chart, statusBreakdown, loading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 no-print">
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px] flex flex-col relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[2.5rem] z-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> 
          {reportType === "salesSummary" ? "Revenue Timeline" : reportType === "customerReport" ? "Customer Value Distribution" : "Tax Breakdown"}
        </h3>
        <div className="flex-1 w-full bg-slate-50/50 rounded-3xl p-6">
          <ResponsiveContainer width="100%" height={380}>
            {reportType === "salesSummary" ? (
              <BarChart data={chart} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} angle={-45} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 800 }} cursor={{ fill: 'rgba(37,99,235,0.03)' }} />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={chart.length > 12 ? 22 : 44}>
                  {chart.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            ) : reportType === "customerReport" ? (
              <BarChart data={chart} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie 
                  data={chart} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={80} 
                  outerRadius={130} 
                  paddingAngle={8} 
                  dataKey="value" 
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chart.map((e, i) => <Cell key={`p-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Comparison Panel */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[2.5rem] z-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <PieChartIcon size={20} className="text-blue-600" /> Status Comparison
        </h3>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusBreakdown} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={70} 
                  paddingAngle={5} 
                  dataKey="count" 
                  nameKey="status"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={STATUS_COLORS[entry.status] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {['Paid', 'Due', 'Overdue'].map(status => {
              const data = statusBreakdown.find(s => s.status === status) || { count: 0, amount: 0 };
              const color = STATUS_COLORS[status];
              return (
                <div key={status} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{status}</p>
                      <p className="text-sm font-black text-slate-900">{data.count} Bills</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-900">₹{Number(data.amount || 0).toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualInsights;
