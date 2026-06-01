import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  getSalesReport,
  getTaxReport,
  getCustomerDetailedReport,
  getRevenueChartData,
  getInvoiceStatusReport,
} from '../../lib/api';
import ReportHeader from './subcomponents/ReportHeader';
import ReportFilters from './subcomponents/ReportFilters';
import ReportStats from './subcomponents/ReportStats';
import VisualInsights from './subcomponents/VisualInsights';
import FinancialLedger from './subcomponents/FinancialLedger';
import ReportsSkeleton from './ReportsSkeleton';
import ReportPrintPreviewModal from './subcomponents/ReportPrintPreviewModal';
import { BackButton } from '../Reusables/BackButton';
import { getDatePresets } from './reportsUtils';
import { useToast } from '../../context/ToastContext';
import { saveCsvFile } from '../../lib/csvExport';
import { useFinancialYear } from '../../context/FinancialYearContext';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';

export default function Reports() {
  const { showToast } = useToast();
  const {
    startDate: fyStart,
    endDate: fyEnd,
    label: fyLabel,
    selectedStartYear,
  } = useFinancialYear();
  const isFetching = useRef(false);
  const hasLoadedOnce = useRef(false);

  const [reportType, setReportType] = useState('salesSummary');
  const [startDate, setStartDate] = useState(fyStart);
  const [endDate, setEndDate] = useState(fyEnd);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const [reportState, setReportState] = useState({
    sales: [],
    taxMetrics: { taxable_value: 0, total_tax: 0, total_invoices: 0, total_amount: 0 },
    customers: [],
    chart: [],
    statusBreakdown: [],
    taxComparison: [],
    loading: true,
    error: null,
  });

  const fetchReportData = useCallback(
    async (dateStart = startDate, dateEnd = endDate) => {
      if (isFetching.current) return;

      isFetching.current = true;
      setReportState((prev) => ({ ...prev, loading: true, error: null }));
      setCurrentPage(1);

      try {
        if (dateStart && dateEnd && new Date(dateStart) > new Date(dateEnd)) {
          throw new Error("'From' date cannot be later than 'To' date");
        }

        const newState = {
          sales: [],
          taxMetrics: { taxable_value: 0, total_tax: 0, total_invoices: 0, total_amount: 0 },
          customers: [],
          chart: [],
          statusBreakdown: [],
          taxComparison: [],
        };

        const sales = await getSalesReport(dateStart, dateEnd);
        newState.sales = sales.data || [];

        const statusRes = await getInvoiceStatusReport(dateStart, dateEnd);
        newState.statusBreakdown = statusRes.data || [];

        if (reportType === 'salesSummary') {
          const chartRes = await getRevenueChartData(dateStart, dateEnd);
          const rawData = chartRes.data || [];

          const dataMap = new Map(rawData.map((d) => [d.name, d.sales]));
          let sDate = dateStart
            ? new Date(dateStart)
            : rawData.length > 0
              ? new Date(`${rawData[0].name}-01`)
              : new Date(new Date().getFullYear(), 0, 1);
          let eDate = dateEnd ? new Date(dateEnd) : new Date();

          if (Number.isNaN(sDate.getTime())) sDate = new Date();
          if (Number.isNaN(eDate.getTime())) eDate = new Date();

          const processedChartData = [];
          let curr = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
          const finish = new Date(eDate.getFullYear(), eDate.getMonth(), 1);

          let safety = 0;
          while (curr <= finish && safety < 36) {
            const key = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}`;
            processedChartData.push({
              name: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(curr),
              sales: Number(dataMap.get(key)) || 0,
            });
            curr.setMonth(curr.getMonth() + 1);
            safety++;
          }
          newState.chart = processedChartData;

          const totalAmount = newState.sales.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          const taxableValue = newState.sales.reduce((sum, item) => sum + (Number(item.taxable_value) || 0), 0);
          const totalTax = newState.sales.reduce((sum, item) => sum + (Number(item.tax) || 0), 0);

          newState.taxMetrics = {
            total_amount: Number(totalAmount.toFixed(2)),
            taxable_value: Number(taxableValue.toFixed(2)),
            total_tax: Number(totalTax.toFixed(2)),
            total_invoices: newState.sales.length,
          };
        } else if (reportType === 'taxReport') {
          const tax = await getTaxReport(dateStart, dateEnd);
          const tData = tax?.data || {};
          newState.taxMetrics = {
            ...tData,
            total_amount: Number((Number(tData.total_amount) || 0).toFixed(2)),
            taxable_value: Number((Number(tData.taxable_value) || 0).toFixed(2)),
            total_tax: Number((Number(tData.total_tax) || 0).toFixed(2)),
            total_invoices: Number(tData.total_invoices) || 0,
          };

          newState.taxComparison = [
            { name: 'Intra-State', count: Number(tData.state_count) || 0, amount: Number(tData.state_amount) || 0 },
            { name: 'Inter-State', count: Number(tData.interstate_count) || 0, amount: Number(tData.interstate_amount) || 0 },
          ];

          newState.chart = [
            { name: 'CGST', value: Number((Number(tData.total_cgst) || 0).toFixed(2)) },
            { name: 'SGST', value: Number((Number(tData.total_sgst) || 0).toFixed(2)) },
            { name: 'IGST', value: Number((Number(tData.total_igst) || 0).toFixed(2)) },
          ].filter((d) => d.value > 0);
        } else if (reportType === 'customerReport') {
          const customers = await getCustomerDetailedReport(dateStart, dateEnd);
          newState.customers = customers?.data || [];

          newState.chart = newState.customers.slice(0, 10).map((c) => ({
            name: c.customer,
            sales: Number((Number(c.total_revenue) || 0).toFixed(2)),
            count: Number(c.total_invoices) || 0,
          }));

          const totalAmt = newState.customers.reduce((sum, c) => sum + (Number(c.total_revenue) || 0), 0);
          newState.taxMetrics.total_amount = Number(totalAmt.toFixed(2));
          newState.taxMetrics.total_invoices = newState.sales.length;
        }

        setReportState((prev) => ({ ...prev, ...newState, loading: false, error: null }));
        hasLoadedOnce.current = true;
      } catch (err) {
        setReportState((prev) => ({ ...prev, loading: false, error: err.message }));
      } finally {
        isFetching.current = false;
      }
    },
    [reportType, startDate, endDate]
  );

  useEffect(() => {
    setStartDate(fyStart);
    setEndDate(fyEnd);
  }, [fyStart, fyEnd, selectedStartYear]);

  useEffect(() => {
    fetchReportData(fyStart, fyEnd);
  }, [reportType, selectedStartYear, fyStart, fyEnd, fetchReportData]);

  const handlePreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
    fetchReportData(preset.start, preset.end);
  };

  const recordCount =
    reportType === 'customerReport'
      ? reportState.customers.length
      : reportType === 'taxReport'
        ? reportState.taxMetrics.total_invoices
        : reportState.sales.length;

  const handleExport = async () => {
    let csvContent = '';
    const timestamp = new Date().toISOString().slice(0, 10);
    if (reportType === 'salesSummary') {
      csvContent = 'Date,Invoice Number,Customer Name,Amount (INR),Tax (INR),Status\n';
      reportState.sales.forEach((row) => {
        csvContent += `${row.date},${row.invoice},"${row.customer}",${row.amount},${row.tax},${row.invoice_status}\n`;
      });
    } else if (reportType === 'customerReport') {
      csvContent = 'Customer Name,Total Invoices,Life-time Revenue (INR)\n';
      reportState.customers.forEach((row) => {
        csvContent += `"${row.customer}",${row.total_invoices},${row.total_revenue}\n`;
      });
    } else if (reportType === 'taxReport') {
      const tm = reportState.taxMetrics;
      csvContent = 'Metric,Accounting Value (INR)\n';
      csvContent += `Total Invoices,${tm.total_invoices || 0}\nCGST,${tm.total_cgst || 0}\nSGST,${tm.total_sgst || 0}\nIGST,${tm.total_igst || 0}\nTotal GST,${tm.total_tax || 0}\nTaxable Value,${tm.taxable_value || 0}\nGross Turnover,${tm.total_amount || 0}\n`;
    }
    try {
      const result = await saveCsvFile(
        csvContent,
        `Report_${reportType}_${timestamp}.csv`,
        { title: 'Save report CSV' }
      );
      if (result.cancelled) {
        showToast('Export cancelled.', 'info');
        return;
      }
      showToast('Report CSV saved successfully.', 'success');
    } catch {
      showToast('Failed to export CSV.', 'error');
    }
  };

  const handleOpenPrintPreview = () => {
    if (reportState.loading) {
      showToast('Please wait for the report to finish loading.', 'info');
      return;
    }
    if (reportState.error) {
      showToast('Fix report errors before printing.', 'error');
      return;
    }
    const hasRows =
      reportType === 'taxReport'
        ? true
        : reportType === 'customerReport'
          ? reportState.customers.length > 0
          : reportState.sales.length > 0;
    if (!hasRows) {
      showToast('No data to print for this period.', 'error');
      return;
    }
    setPrintPreviewOpen(true);
  };

  const handleConfirmPrint = () => {
    window.print();
  };

  const showSkeleton = reportState.loading && !hasLoadedOnce.current;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto no-print">
        <BackButton className="!mb-2" />

        {showSkeleton ? (
          <ReportsSkeleton />
        ) : (
          <>
            <div className="mb-4 lg:hidden">
              <FinancialYearSelector />
            </div>

            <ReportHeader
              reportType={reportType}
              startDate={startDate}
              endDate={endDate}
              fyLabel={fyLabel}
              onExport={handleExport}
              onPrint={handleOpenPrintPreview}
              recordCount={recordCount}
            />

            {reportState.error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Could not load report</p>
                  <p className="text-sm mt-0.5 opacity-90">{reportState.error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchReportData()}
                  className="text-sm font-semibold text-red-700 hover:underline shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            <ReportFilters
              reportType={reportType}
              setReportType={setReportType}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onRunAnalysis={() => fetchReportData()}
              onPresetSelect={handlePreset}
              loading={reportState.loading}
            />

            <ReportStats
              taxMetrics={reportState.taxMetrics}
              customers={reportState.customers}
              reportType={reportType}
              sales={reportState.sales}
              loading={reportState.loading}
            />

            <VisualInsights
              reportType={reportType}
              chart={reportState.chart}
              statusBreakdown={reportState.statusBreakdown}
              loading={reportState.loading}
            />

            <FinancialLedger
              reportType={reportType}
              sales={reportState.sales}
              customers={reportState.customers}
              taxMetrics={reportState.taxMetrics}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              loading={reportState.loading}
            />
          </>
        )}
      </div>

      <ReportPrintPreviewModal
        isOpen={printPreviewOpen}
        onClose={() => setPrintPreviewOpen(false)}
        onConfirmPrint={handleConfirmPrint}
        reportType={reportType}
        sales={reportState.sales}
        customers={reportState.customers}
        taxMetrics={reportState.taxMetrics}
        statusBreakdown={reportState.statusBreakdown}
        startDate={startDate}
        endDate={endDate}
        recordCount={recordCount}
      />
    </div>
  );
}
