import React from 'react';
import { Calendar, Play, RotateCcw } from 'lucide-react';
import { REPORT_TYPES, getDatePresets } from '../reportsUtils';

const ReportFilters = ({
  reportType,
  setReportType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onRunAnalysis,
  onPresetSelect,
  loading,
}) => {
  const presets = getDatePresets();

  const applyPreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
    onPresetSelect?.(preset);
  };

  const isPresetActive = (preset) => preset.start === startDate && preset.end === endDate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6 space-y-5 no-print">
      {/* Report type tabs */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Report type
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {REPORT_TYPES.map((type) => {
            const active = reportType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setReportType(type.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-brand-primary bg-indigo-50/80 ring-1 ring-brand-primary/20'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <p className={`font-semibold text-sm ${active ? 'text-brand-primary' : 'text-slate-800'}`}>
                  {type.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar size={14} />
            Date range
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isPresetActive(preset)
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => applyPreset(presets.find((p) => p.id === 'all'))}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            title="Clear dates"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={loading}
            className="btn-cta-primary !py-2.5 !px-5 !text-sm min-w-[140px] disabled:opacity-50"
          >
            <Play size={16} className={loading ? 'opacity-0' : ''} />
            {loading ? 'Loading…' : 'Apply filters'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
